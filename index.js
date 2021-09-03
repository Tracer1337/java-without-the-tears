require("dotenv").config()
const { Command } = require("commander")
const path = require("path")

function moduleExists(path) {
    try {
        require(path)
        return true
    } catch {
        return false
    }
}

const program = new Command()
program
    .version("1.0.0")
    .option("-classpath <path>", "class search path of directories")

const options = program.parse().opts()
const [className] = program.args

if (!className) {
    throw new Error("No class specified")
}

const classFilename = className + ".java"
let classPath = path.join(process.cwd(), options.Classpath, classFilename)

if (!moduleExists(classPath)) {
    classPath = path.join(process.cwd(), options.Classpath, className)
}

if (!moduleExists(classPath)) {
    throw new Error(`Class '${className}' does not exist in ${options.Classpath}`)
}

const classModule = require(classPath)
const moduleDefault = classModule.default || classModule
const main = moduleDefault.main

if (!main) {
    throw new Error("Missing main method in class " + className)
}

main.call(moduleDefault, program.args.slice(1))
