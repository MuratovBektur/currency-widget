import mongoose from "mongoose";

const connectBD = () => {
  mongoose.connect(
    "mongodb+srv://user:user@cluster0.cnakz.mongodb.net/currencies?retryWrites=true&w=majority",
    { useUnifiedTopology: true, useNewUrlParser: true }
  );
};
mongoose.set("useFindAndModify", false);

process.on("SIGINT", function () {
  mongoose.connection.close(function () {
    console.log("Mongoose disconnected on app termination");
    process.exit(0);
  });
});

export default connectBD;
