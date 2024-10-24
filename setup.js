import fs from "fs";
import path from "path";

async function fileExists(filePath) {
  try {
    await fs.promises.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function copyFile(src, dest) {
  try {
    if (await fileExists(dest)) {
      console.log(`File already exists at ${dest}, skipping copy.`);
    } else {
      await fs.promises.copyFile(src, dest);
      console.log(`Copied ${src} to ${dest}`);
    }
  } catch (err) {
    console.error(`Error copying file from ${src} to ${dest}:`, err);
  }
}
async function dirExists(dirPath) {
  try {
    await fs.promises.access(dirPath);
    return true;
  } catch {
    return false;
  }
}

async function createAccountsDir() {
  try {
    const dirPath = "accounts";
    const exists = await dirExists(dirPath);
    if (exists) {
      console.log(`Accounts Dir already exists, skipping creation.`);
      return;
    }

    await fs.promises.mkdir(dirPath, { recursive: true });
    console.log(`Accounts Dir created`);
  } catch (err) {
    console.error(`Error creating accounts directory:`, err);
  }
}

const copyOperations = [
  {
    src: path.join("config", "config_tmp.js"),
    dest: path.join("config", "config.js"),
  },
  {
    src: path.join("config", "proxy_list_tmp.js"),
    dest: path.join("config", "proxy_list.js"),
  },
];

(async () => {
  await createAccountsDir();
  console.log(`Copying Template File`);
  for (let { src, dest } of copyOperations) {
    await copyFile(src, dest);
  }
  console.log(`\nSetup Complete`);
  console.log(`Open and configure\n- config/config.js\n- config/proxy_list.js`);
})();
