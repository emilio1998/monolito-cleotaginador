import winston from "winston";
import morgan from "morgan";
import "winston-daily-rotate-file";
import moment from "moment";

const level = 'http';

const dailyRotationTransport = new winston.transports.DailyRotateFile({
  filename: "RM-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: false,
  maxSize: "20m",
  maxFiles: "30d",
  dirname: "logs/",
  frequency: "24h",
});

const httpLogger = winston.createLogger({
  level: level,
  format: winston.format.combine(
    winston.format.timestamp({
      format: () => {
        return moment().format();
      },
    }),
    winston.format.printf((msg) => {
      let string = msg.message.split(" ");
      let output = string.slice(1).join(" ");
      let method = string[1];
      /*pool.query("INSERT INTO LOGS (LEVEL, MESSAGE, IPADDRESS, METHOD) VALUES ?", [[msg.level, output, string[0], method]]);*/
      return `{"fecha":${msg.timestamp}, "level":"${msg.level}","message":"${msg.message}"}`;
    })
  ),
  transports: [
    new winston.transports.Console({
      level: level,
      format: winston.format.combine(
        winston.format.timestamp({
          format: "YYYY-MM-DD HH:mm:ss",
        }),
        winston.format.colorize(),
        winston.format.simple(),
        winston.format.printf((msg) => {
          return `${msg.level}: ["fecha":${msg.timestamp}] ["message":"${msg.message}"]`;
        })
      ),
    }),
    dailyRotationTransport,
  ],
});
morgan.token("body", (req,res) => {
  return JSON.stringify(req.body);
});
const morganLogger = morgan(
  ":remote-addr :method :url :body :status :res[content-length] - :response-time ms",
  {
    stream: {
      write: (message) => httpLogger.http(message.trim()),
    },
  }
);

export default morganLogger;