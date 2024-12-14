import { logger, schedules, wait } from "@trigger.dev/sdk/v3";
import client, { geminiClient, resendClient } from "../utils";
import crypto from 'crypto';

interface JobPosting {
  jobTitle: string;
  jobDescriptionSummary: string;
}

const LEGAL_KEYWORDS = [
  "law",
  "lawyer",
  "legal officer",
  "compliance officer",
  "legal executive",
  "law firm",
  "oil and gas",
  "oil & gas",
];

async function extractJobInfo(text: string): Promise<JobPosting | null> {
  const model = geminiClient.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  try {
    const prompt = `Extract job information using this JSON schema:

JobPosting = {
  'jobTitle': string,  // Include company name if mentioned
  'jobDescriptionSummary': string  // Max 100 words summary
}
Return: JobPosting

Text to analyze: ${text}`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const responseText = response.text();

    const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
    if (!jsonMatch) {
      throw new Error('Could not find JSON in response');
    }

    const jsonString = jsonMatch[1];

    const parsed: JobPosting = JSON.parse(jsonString);

    logger.log("Parsed response", { parsed });
    if (!parsed.jobTitle || !parsed.jobDescriptionSummary) {
      throw new Error('Invalid response structure');
    }
    
    return parsed;
  } catch (error) {
    logger.error("Error processing with Gemini", { error });
    return null;
  }
}

export const firstScheduledTask = schedules.task({
  id: "scheduled-legal-jobs-scraping",
  cron: {
    pattern: "0 9 * * *",
    timezone: "Europe/Paris",
  },
  
  run: async () => {
    try {
      await client.connect();
      const messages = await client.getMessages(process.env.TELEGRAM_CHANNEL_USERNAME, {
        limit: 500,
       
      });

      // Filter messages containing legal keywords
      const legalMessages = messages.filter((msg) => {
        const messageText = msg.message?.toLowerCase() || "";
        return LEGAL_KEYWORDS.some(keyword => messageText.includes(keyword.toLowerCase()));
      });

      const processedJobs = [];
      for (const msg of legalMessages) {
        const jobInfo = await extractJobInfo(msg.message);
        if (jobInfo) {
          processedJobs.push({
            originalMessage: msg.message,
            ...jobInfo,
            messageDate: new Date(msg.date * 1000).toISOString(),
          });
        }
      }

      // Create CSV data
      const headers = ['Job Title,Job Description Summary,Original Message,Date\n'];
      const csvLines = processedJobs.map(job => 
        `"${job.jobTitle}","${job.jobDescriptionSummary}","${job.originalMessage.replace(/"/g, '""')}","${job.messageDate}"`
      );
      const csvData = headers.concat(csvLines).join('\n');

      logger.log("Processed legal jobs", { processedJobs });

      logger.log("CSV data", { csvData });
      const base64CSV = Buffer.from(csvData).toString('base64')
      const subjectList = [process.env.EMAIL_ONE, process.env.EMAIL_TWO] as Array<string>
      await resendClient.emails.send({
       from: 'Odogwu Sexc <osa@glamboyosa.xyz>',
       to: subjectList,
       subject: `Legal Jobs List for ${new Date().toISOString().split('T')[0]} 🧹`,
       text: 'Hey, Find the attached CSV file containing the legal jobs list',
       attachments: [
         {
           content: base64CSV,
           filename: 'legal-jobs-list.csv',
         },
       ],
       headers: {
        'X-Entity-Ref-ID': `legal-jobs-list-${crypto.randomUUID()}`,
       }
     });


    } catch (error) {
      logger.error("Error fetching messages", { error });
    }
  },
});