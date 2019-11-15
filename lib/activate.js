const vscode = require("vscode");
const fs = require("fs");
const {
  GO_TO_SCSS_COMMAND,
  CODE_FILE_REGEXP,
  STYLE_REGEXP,
  SCSS_TYPE,
  SASS_TYPE,
  CSS_TYPE,
  NODE_MODULES_FOLDER
} = require("./command");

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
      const suffixStyles = [SCSS_TYPE, SASS_TYPE, CSS_TYPE];

      if (!isStyleFile.test(openedFile)) {
        const suffixToOpen = suffixStyles
          .map(
            style =>
              `${path}${filenameWithoutExtension}${style}`
          )
          .filter(style => fs.existsSync(style));

        if (suffixToOpen.length > 0) {
          vscode.workspace
            .openTextDocument(vscode.Uri.file(suffixToOpen[0]))
            .then(vscode.window.showTextDocument);
        } else {
          const fileToOpen = `**${lastPath}${filenameWithoutExtension}${filenameExtension}`;
          vscode.workspace
            .findFiles(fileToOpen, NODE_MODULES_FOLDER)
            .then(files => {
              vscode.workspace
                .openTextDocument(vscode.Uri.file(files[0].fsPath))
                .then(vscode.window.showTextDocument);
            });
        }
      } else {
        let fileToOpen = openedFileName;
        suffixStyles.forEach(style => {
          fileToOpen = fileToOpen.replace(style, "");
        });
        if (fs.existsSync(fileToOpen)) {
          vscode.workspace
            .openTextDocument(vscode.Uri.file(fileToOpen))
            .then(vscode.window.showTextDocument);
        } else {
          fileToOpen = `**${lastPath}${filenameWithoutExtension}${filenameExtension}`.replace(
            "_style",
            ""
          );
          vscode.workspace
            .findFiles(fileToOpen, NODE_MODULES_FOLDER)
            .then(files => {
              vscode.workspace
                .openTextDocument(vscode.Uri.file(files[0].fsPath))
                .then(vscode.window.showTextDocument);
            });
        }
      }
    }
  );

  context.subscriptions.push(subscription);
};

module.exports = activate;
