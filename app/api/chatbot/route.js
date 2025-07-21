// app/api/chatbot/route.js
import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@supabase/supabase-js'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: 'models/gemini-1.5-flash-latest' })

const supabase = createClient(process.env.DATABASE_URL, process.env.SUPABASE_ANON_KEY)

export async function POST(req) {
  const { messages } = await req.json()

  // Temporary: hardcoded userId for demo/testing
  const userId = '490c2e6e-d090-462f-89d7-788af603e848' // Replace with real logic later

  // Step 1: Get transactions (last 7 days)
  /* const { data: transactions, error } = await supabase
    .from('transactions')
    .select('amount, date, category')
    .eq('userId', userId)
    .eq('status', 'COMPLETED')
    .gte('date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()) // Last 7 days
console.log("Fetched Transactions: ", transactions)*/
const { data: transactions, error } = await supabase
  .from('transactions')
  .select('*')          // no filters – simplest query
  .limit(1)

console.log('➜ transactions:', transactions)  // <– null
console.log('➜ error:', error) 
  // Last 7 days

  // Step 2: Fallback if no data
  if (!transactions || transactions.length === 0) {
    return Response.json({
      reply: `Since there are no recent transactions, I recommend setting up automatic budget tracking to gain a clear picture of your spending habits.`,
    })
  }
 /*const transactions = [
  { amount: 200, date: '2025-07-09', category: 'Food' },
  { amount: 1200, date: '2025-07-12', category: 'Shopping' },
  { amount: 500, date: '2025-07-14', category: 'Transport' }
]*/

  // Step 3: Build transaction summary for prompt
  const summary = transactions.map(tx => {
    const date = new Date(tx.date).toLocaleDateString()
    return `• ₹${tx.amount} on ${tx.category} (${date})`
  }).join('\n')

  // Step 4: Build prompt for Gemini
  const prompt = `
You are a financial assistant. Based on the user's recent transactions, give them personalized spending advice.

Recent Transactions:
${summary}

Respond with practical financial insights, suggest budget tips, and highlight any patterns you observe.
`

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const reply = response.text()
    return Response.json({ reply })
  } catch (err) {
    console.error('Gemini Error:', err)
    return Response.json({
      reply: '⚠️ Sorry, I couldn’t generate a response right now. Please try again later.',
    }, { status: 500 })
  }
}
