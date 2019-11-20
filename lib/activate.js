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

const openTextEditor = filename => {
  vscode.workspace
    .openTextDocument(vscode.Uri.file(filename))
    .then(vscode.window.showTextDocument);
};

const openFile = fileToOpen => {
  vscode.workspace.findFiles(fileToOpen, NODE_MODULES_FOLDER).then(files => {
    openTextEditor(files[0].fsPath);
  });
};

const fetchFile = (extension, path, filenameWithoutExtension) => {
  return extension
    .map(ext => `${path}${filenameWithoutExtension}${ext}`)
    .filter(file => fs.existsSync(file));
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
        const suffixToOpen = fetchFile(
          styleExtensions,
          path,
          filenameWithoutExtension
        );

        if (suffixToOpen.length > 0) {
          openTextEditor(suffixToOpen[0]);
        } else {
          const fileToOpen = `**${lastPath}${filenameWithoutExtension}${filenameExtension}`;
          openFile(fileToOpen);
        }
      } else {
        const fileToOpen = fetchFile(
          codeExtensions,
          path,
          filenameWithoutExtension
        );
        if (fileToOpen.length > 0) {
          openTextEditor(fileToOpen[0]);
        }
      }
    }
  );

  context.subscriptions.push(subscription);
};

module.exports = activate;
