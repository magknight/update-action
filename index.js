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
	core.info("It's running");
	return true;
	// const client = new ftp.Client();
	// client.ftp.verbose = true;
	// try {
	// 	await client.access({
	// 		host: ftpUrl,
	// 		user: username,
	// 		password: password,
	// 		secure: true,
	// 	});
	// 	await client.downloadTo("updateListing.json", "updateListing.json");
	// } catch (err) {
	// 	console.log(err);
	// }
	// client.close();
}

download();
