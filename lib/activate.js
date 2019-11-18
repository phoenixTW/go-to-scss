const vscode = require("vscode");
const fs = require("fs");
const {
  GO_TO_SCSS_COMMAND,
  CODE_FILE_REGEXP,
  STYLE_REGEXP,
  SCSS_TYPE,
  SASS_TYPE,
  CSS_TYPE,
  JS_TYPE,
  NODE_MODULES_FOLDER
} = require("./command");

const openFile = filename => {
  vscode.workspace
    .openTextDocument(vscode.Uri.file(filename))
    .then(vscode.window.showTextDocument);
};

const activate = context => {
  const subscription = vscode.commands.registerCommand(
    GO_TO_SCSS_COMMAND,
    () => {
      if (!vscode.workspace.name) return;

      const activeTextEditor = vscode.window.activeTextEditor;
      if (!activeTextEditor) return;

      const openedFileName = activeTextEditor.document.fileName;
      const isCodeFile = CODE_FILE_REGEXP;

      const openedFile = openedFileName.match(isCodeFile);

      const path = openedFile[1];
      const lastPath = openedFile[2];
      const filenameWithoutExtension = openedFile[3];
      const filenameExtension = openedFile[4];

      const isStyleFile = STYLE_REGEXP;
      const styleExtensions = [SCSS_TYPE, SASS_TYPE, CSS_TYPE];
      const codeExtensions = [JS_TYPE];

      if (!isStyleFile.test(openedFile)) {
        const suffixToOpen = styleExtensions
          .map(style => `${path}${filenameWithoutExtension}${style}`)
          .filter(style => fs.existsSync(style));

        if (suffixToOpen.length > 0) {
          openFile(suffixToOpen[0]);
        } else {
          const fileToOpen = `**${lastPath}${filenameWithoutExtension}${filenameExtension}`;
          vscode.workspace
            .findFiles(fileToOpen, NODE_MODULES_FOLDER)
            .then(files => {
              openFile(files[0].fsPath);
            });
        }
      } else {
        const fileToOpen = codeExtensions
          .map(ext => `${path}${filenameWithoutExtension}${ext}`)
          .filter(code => fs.existsSync(code));
        if (fileToOpen.length > 0) {
          openFile(fileToOpen[0]);
        }
      }
    }
  );

  context.subscriptions.push(subscription);
};

module.exports = activate;
