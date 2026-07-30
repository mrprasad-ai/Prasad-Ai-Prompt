require("dotenv").config({ path: ".env.local" });

const { Client } = require("@notionhq/client");

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

async function main() {
  const result = await notion.search({
    filter: {
      value: "data_source",
      property: "object",
    },
  });

  console.log(JSON.stringify(result, null, 2));
}

main().catch(console.error);