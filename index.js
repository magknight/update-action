const core = require("@actions/core");
const fs = require("fs");
const path = require("path");
const ftp = require("basic-ftp");
var version = core.getInput("version", { required: true });
var username = core.getInput("username", { required: true });
var password = core.getInput("password", { required: true });
var ftpUrl = core.getInput("ftpUrl", { required: true });
core.setSecret("username");
core.setSecret("password");
async function download() {
	core.info("Beginning download setup");
	// return true;
	const client = new ftp.Client();
	client.ftp.verbose = true;
	try {
		await client.access({
			host: ftpUrl,
			user: username,
			password: password,
			secure: true,
		});
		core.info("Downloading");
		await client.downloadTo("updaterListing.json", "updaterListing.json");
	} catch (err) {
		console.log(err);
	}
	core.info("Download complete");
	client.close();
}
async function edit() {
	var file = await fs.readFileAsync("./updaterListing.json");
	var content = JSON.parse(file);
	core.info(content);
}

async function run() {
	await download();
	await edit();
}
run();
