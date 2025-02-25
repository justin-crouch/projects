import { load } from "@tauri-apps/plugin-store";
import { API_STORE_NAME } from "./globals";

// Load database file for storing repo api information
// Initialize attributes if they don't exist
export async function loadDB()
{
  // Load/Create repo database
  const repoDB = await load(API_STORE_NAME);

  // Initialize attributes if needed
  if(!await repoDB.has("repos"))
  {
    await repoDB.set("repos", {});
  }
  await repoDB.save();

  // Return database
  return repoDB;
}

// Create/Update repo api information in specified database
export async function appendRepoEntry(db, title, name, owner, token)
{
  // 'owner/name' represents id in database
  const id = owner + "/" + name;

  // Get repo list
  const repos = await db.get("repos");

  // Insert new repo information in repo list and update db repos
  repos[id] = {
    id: id,
    name: name,
    owner: owner,
    token: token,
    title: title
  };
  await db.set("repos", repos);

  // Save database
  await db.save();
}

// Get all repo entries in database
export async function getRepoEntries(db)
{
   // Get repo list
  const repos = await db.get("repos");

//  return repos;
  return Object.values(repos);
}
