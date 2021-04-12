import mongoose from "mongoose";
import axios from "axios";

const Schema = mongoose.Schema;

interface ICurrency {
  _id: string;
  name: string;
  rate: number;
}

const connectMongoose = async () => {
  await mongoose.connect(
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

const currencyScheme = new Schema(
  { name: String, rate: Number },
  { versionKey: false }
);

currencyScheme.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
const Currency = mongoose.model("currency", currencyScheme);

const loadToDB = async () => {
  try {
    await connectMongoose();
    await Currency.deleteMany({});
    const { data } = await axios.get("https://api.openrates.io/latest");
    const transformedData = Object.keys(data.rates).map((name, index) => ({
      id: index,
      name,
      rate: data.rates[name],
    }));
    await Currency.create(transformedData);
  } catch (e) {
    console.error(e);
  } finally {
    mongoose.disconnect();
  }
};

class CurrencyModel {
  async getAll(): Promise<string> {
    try {
      await loadToDB();
      await connectMongoose();
      let docs: any | ICurrency[] = await Currency.find({});

      return JSON.stringify({
        success: true,
        currencies: docs,
      });
    } catch (e) {
      return JSON.stringify({
        success: false,
        reason: e.message,
      });
    } finally {
      mongoose.disconnect();
    }
  }
  async getById(id: string): Promise<string> {
    try {
      await connectMongoose();
      let doc: any = await Currency.findOne({ _id: id });
      if (doc === null) {
        return JSON.stringify({
          success: false,
          reason: {
            message: `Can't found record with received id`,
          },
        });
      }
      return JSON.stringify({
        success: true,
        currency: doc,
      });
    } catch (e) {
      console.error(e);
      return JSON.stringify({
        success: false,
        reason: e.message,
      });
    } finally {
      mongoose.disconnect();
    }
  }
}

export default new CurrencyModel();
