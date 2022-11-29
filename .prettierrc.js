module.exports = {
    trailingComma: "es5",
    singleQuote: false,
    bracketSpacing: true,
    tabWidth: 4,
    overrides: [
        {
            files: "*.sol",
            options: {
                printWidth: 80,
                tabWidth: 4,
                useTabs: false,
                singleQuote: false,
                bracketSpacing: false,
            },
        },
    ],
};
