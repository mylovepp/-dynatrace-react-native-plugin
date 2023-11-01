#!/usr/bin/env node
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const checkIfFileExists = (_file) => new Promise((resolve, reject) => {
    fs.stat(_file, (err) => {
        if (err) {
            reject(`${err} - File doesn't exist: ${path.resolve(_file)}`);
        }
        resolve(_file);
    });
});
const checkIfFileExistsSync = (_file) => {
    fs.statSync(_file);
    return _file;
};
const readTextFromFileSync = (_file) => fs.readFileSync(_file, 'utf8');
const readTextFromFile = (_file) => new Promise((resolve, reject) => {
    fs.readFile(_file, 'utf8', (err, data) => {
        if (err) {
            reject(err + 'Could not read the file: ' + path.resolve(_file));
        }
        resolve(data);
    });
});
const writeTextToFile = (_file, _text) => new Promise((resolve, reject) => {
    fs.writeFile(_file, _text, (err) => {
        if (err) {
            reject(err + ' Could not write to file: ' + path.resolve(_file));
        }
        resolve(_file);
    });
});
const writeTextToFileSync = (_file, _text) => {
    try {
        fs.writeFileSync(_file, _text);
        return _file;
    }
    catch (err) {
        throw new Error(err + ' Could not write to file: ' + path.resolve(_file));
    }
};
const createDirectorySync = (directory) => {
    try {
        mkdirSyncRecursive(directory);
        return true;
    }
    catch (e) {
        return false;
    }
};
const mkdirSyncRecursive = (directory) => {
    const pathParts = directory.split(path.sep);
    for (let i = 1; i <= pathParts.length; i++) {
        const segment = pathParts.slice(0, i).join(path.sep);
        if (segment.length > 0) {
            if (!fs.existsSync(segment)) {
                fs.mkdirSync(segment);
            }
        }
    }
};
const deleteDirectory = (dir) => new Promise((resolve, reject) => {
    fs.access(dir, (err) => {
        if (err) {
            return reject(err);
        }
        fs.readdir(dir, (err, files) => {
            if (err) {
                return reject(err);
            }
            Promise.all(files.map((file) => deleteFile(path.join(dir, file)))).then(() => {
                fs.rmdir(dir, (err) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve();
                });
            }).catch(reject);
        });
    });
});
const deleteDirectorySync = (dir) => {
    fs.accessSync(dir);
    const files = fs.readdirSync(dir);
    files.map((file) => deleteFileSync(path.join(dir, file)));
    fs.rmdirSync(dir);
};
const deleteFile = (filePath) => new Promise((resolve, reject) => {
    fs.lstat(filePath, (err, stats) => {
        if (err) {
            return reject(err);
        }
        if (stats.isDirectory()) {
            resolve(deleteDirectory(filePath));
        }
        else {
            fs.unlink(filePath, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        }
    });
});
const deleteFileSync = (filePath) => {
    const stats = fs.lstatSync(filePath);
    if (stats.isDirectory()) {
        deleteDirectorySync(filePath);
    }
    else {
        fs.unlinkSync(filePath);
    }
};
const renameFile = (fileOld, fileNew) => new Promise((resolve, reject) => {
    fs.rename(fileOld, fileNew, (err) => {
        if (err) {
            reject(err);
        }
        resolve();
    });
});
const renameFileSync = (fileOld, fileNew) => {
    fs.renameSync(fileOld, fileNew);
};
const copyFile = (filePath, destPath) => new Promise((resolve, reject) => {
    fs.copyFile(filePath, destPath, (err) => {
        if (err) {
            reject(err);
        }
        resolve();
    });
});
const copyFileSync = (filePath, destPath) => {
    fs.copyFileSync(filePath, destPath);
};
const copyDirectory = (from, to) => {
    fs.mkdirSync(to);
    fs.readdirSync(from).forEach((element) => {
        if (fs.lstatSync(path.join(from, element)).isFile()) {
            fs.copyFileSync(path.join(from, element), path.join(to, element));
        }
        else {
            copyDirectory(path.join(from, element), path.join(to, element));
        }
    });
};
exports.default = {
    checkIfFileExists,
    checkIfFileExistsSync,
    readTextFromFile,
    readTextFromFileSync,
    writeTextToFile,
    writeTextToFileSync,
    deleteDirectory,
    deleteFile,
    deleteFileSync,
    createDirectorySync,
    renameFile,
    renameFileSync,
    copyFile,
    copyFileSync,
    copyDirectory,
};
