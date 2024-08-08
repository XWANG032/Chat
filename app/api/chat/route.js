import {NextResponse} from 'next/server'
import OpenAI from 'openai'

const systemPrompt = `You are HeadstarterAI's Customer Support Bot. Assist users with inquiries about our AI-powered interview platform for software engineering jobs. Be friendly, professional, and concise.

1. General Inquiries: Explain features, benefits, and how our AI interviews work.
2. Account Issues: Help with login, password resets, and updating info.
3. Technical Support: Troubleshoot common issues and escalate complex problems.
4. Interview Preparation: Provide tips and resources for AI interview preparation.
5. Feedback and Complaints: Handle feedback and complaints, and forward details if needed.
6. Product Updates: Inform users about updates and new features.
7. Maintain a supportive tone, provide accurate information, and ensure user privacy.`

export async function POST(req){
    const openai = new OpenAI()
    const data = await req.json()

    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content: systemPrompt,
            },
            ...data,
        ],
        model: 'gpt-4o-mini',
        stream: true,
    })

    const stream = new ReadableStream({
        async start(controller){
            const encoder = new TextEncoder()
            try{
                for await (const chunk of completion){
                    const content = chunk.choices[0]?.delta?.content
                    if (content){
                        const text = encoder.encode(content)
                        controller.enqueue(text)
                    }
                }
            } catch(err) {
                controller.error(err)
            } finally {
                controller.close()
            }
        }
    })

    return new NextResponse(stream)
}