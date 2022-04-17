const core = require("@actions/core");
const fs = require("fs");
const path = require("path");
const ftp = require("basic-ftp");
const { match } = require("assert");
var version = core.getInput("version", { required: true });
var username = core.getInput("username", { required: true });
var password = core.getInput("password", { required: true });
var ftpUrl = core.getInput("ftpUrl", { required: true });
var fileName = "updaterListing.json";
core.setSecret("username");
core.setSecret("password");
const client = new ftp.Client();
// client.ftp.verbose = true;
async function download() {
	core.info("Beginning download setup");
	try {
		await client.access({
			host: ftpUrl,
			user: username,
			password: password,
			secure: true,
		});
		core.info("Downloading");
		await client.downloadTo(fileName, fileName);
	} catch (err) {
		core.error(err);
	} finally {
		core.info("Download complete");
		client.close();
		return;
	}
}
async function upload() {
	core.info("Beginning download setup");
	try {
		await client.access({
			host: ftpUrl,
			user: username,
			password: password,
			secure: true,
		});
		core.info("Uploading ");
		await client.uploadFrom(`output-${fileName}`, fileName);
	} catch (err) {
		core.error(err);
	} finally {
		core.info("Download complete");
		client.close();
		return;
	}
}

async function identifyBranch() {
	try {
		if (!/v\d+.\d+.\d+/.test(version)) {
			throw new Error(
				`Version string does not fit required format: '${version}'`
			);
		}
		if (/alpha/.test(version)) {
			return ["aviatorsEditionCygnus", "alpha"];
		} else if (/beta/.test(version)) {
			return ["aviatorsEditionCygnus", "beta"];
		} else if (/libra/.test(version)) {
			return ["aviatorsEditionLibra", "libra"];
		} else if (!/-/.test(version)) {
			return ["aviatorsEditionLive", "stable"];
		} else if (/releaseCandidate/.test(version)) {
			return ["aviatorsEditionLive", "releaseCandidate"];
		}
	} catch (err) {
		throw new Error("Branch unknown");
	}
}

async function edit(branch, branchType) {
	core.info(`Reading File ${fileName}`);
	try {
		var file = fs.readFileSync(fileName);
		var content = JSON.parse(file);
		core.info(content);
		content[branch] = {
			name: branch,
			type: branchType,
			version: version,
			dateTime: Math.floor(Date.now() / 1000),
			enabled: true,
		};
		fs.writeFileSync(`output-${fileName}`, JSON.stringify(content));
	} catch (err) {
		throw new Error(error);
	} finally {
		core.info("Written");
		return;
	}
}

async function run() {
	try {
		let [branch, branchType] = await identifyBranch();
		core.info(`Branch is '${branch}'; type is: '${branchType}'`);
		await download();
		await edit(branch, branchType);
		await upload();
	} catch (err) {
		core.error(`An error occurred in updating the updater listing`);
		console.error(err);
	}
	core.info("Mission Complete");
}
run();
