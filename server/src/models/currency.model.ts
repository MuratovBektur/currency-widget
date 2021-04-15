import mongoose from "mongoose";
import axios from "axios";

const Schema = mongoose.Schema;

interface ICurrency {
  _id: string;
  name: string;
  rate: number;
}

const currencyScheme = new Schema(
  { date: String, currencies: [{ name: String, rate: Number }] },
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
    await Currency.deleteMany({});
    const { data } = await axios.get("https://api.openrates.io/latest");
    const date = data.date;
    let transformedData = Object.keys(data.rates).map((name, index) => ({
      name,
      rate: data.rates[name],
    }));

    await Currency.create({ date, currencies: transformedData });
  } catch (e) {
    console.error(e);
  }
};

class CurrencyModel {
  async getAll(): Promise<string> {
    try {
      await loadToDB();

      let docs:
        | any
        | { date: string; currencies: ICurrency[] } = await Currency.find({});

      return JSON.stringify({
        success: true,
        date: docs[0].date,
        currencies: docs[0].currencies.map((currency) => ({
          id: currency._id,
          name: currency.name,
          rate: currency.rate,
        })),
      });
    } catch (e) {
      return JSON.stringify({
        success: false,
        reason: e.message,
      });
    }
  }
  async getById(id: string): Promise<string> {
    try {
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
    }
  }
}

export default new CurrencyModel();
