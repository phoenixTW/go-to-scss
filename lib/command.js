const GO_TO_SCSS_COMMAND = "extension.goToSCSS";
const CODE_FILE_REGEXP = /(.*(\/.*\/))(.*)(\.\w+)$/;
const STYLE_REGEXP = /(\.|_|-)(scss|css|sass|less)\./;
const SCSS_TYPE = ".scss";
const SASS_TYPE = ".sass";
const CSS_TYPE = ".css";
const NODE_MODULES_FOLDER = "**/node_modules/**";

module.exports = {
  GO_TO_SCSS_COMMAND,
  CODE_FILE_REGEXP,
  STYLE_REGEXP,
  SCSS_TYPE,
  SASS_TYPE,
  CSS_TYPE,
  NODE_MODULES_FOLDER
};
