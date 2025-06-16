import { createLogger, format, transports } from "winston";

const { combine, timestamp, printf, colorize, json } = format;

const logger = createLogger({
  level: "info",

  transports: [
    // Console: tampilkan log berwarna dengan format mirip JSON (tapi bukan JSON asli)
    new transports.Console({
      format: combine(
        colorize({ all: true }),
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        printf(({ level, message, timestamp }) => {
          return `{ "level": "${level}", "timestamp": "${timestamp}", "message": "${message}" }`;
        })
      )
    }),

    // File: simpan dalam format JSON asli, tanpa warna
    new transports.File({
      filename: "logs/app.json.log",
      format: combine(
        timestamp(),
        json()
      )
    }),

    new transports.File({
      filename: "logs/error.json.log",
      level: "error",
      format: combine(
        timestamp(),
        json()
      )
    })
  ]
});

export default logger;
