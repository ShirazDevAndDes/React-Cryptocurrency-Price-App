import axios from "axios";
import { useEffect, useState } from "react";

export default function Home() {
  const [searchValue, setSearchValue] = useState("");
  const [coinData, setCoinData] = useState([]);

  async function getSearchCoinData(value) {
    if (value !== "") {
      await axios
        .get("https://api.coingecko.com/api/v3/coins/" + value.toLowerCase())
        .then((response) => {
          const res = response.data;
          console.log(res);
          setCoinData([res]);
        });
      // .catch((err) => {
      //   console.log(err);
      // });
    } else {
      getCoinData();
    }
  }

  async function getCoinData() {
    const coinsArr = ["Bitcoin", "Ethereum", "Tether", "Binance-USD", "Cosmos"];

    await axios
      .all(
        coinsArr.map((coin) =>
          axios.get(
            "https://api.coingecko.com/api/v3/coins/" + coin.toLowerCase()
          )
        )
      )
      .then(
        axios.spread((...response) => {
          const res = response.map((res) => res.data);
          //   console.log(res);
          setCoinData(res);
        })
      )
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    getCoinData();
  }, []);

  return (
    <div className="container">
      <div className="row justify-content-center align-items-center">
        <div className="col-12 col-md-8 mt-5">
          <div className="card text-bg-dark">
            <div className="card-body">
              <input
                type="text"
                className="form-control text-bg-dark border-0 shadow-none"
                placeholder="Search"
                onChange={(e) => {
                  setSearchValue(e.target.value);
                  getSearchCoinData(e.target.value);
                }}
              />
            </div>
          </div>
        </div>
        <div className="col-12 col-md-8 mt-5">
          <div className="card bg-dark">
            <div className="card-body">
              <ul className="list-group list-group-flush">
                {coinData.length > 0 && console.log(coinData)}
                {coinData.length > 0 &&
                  coinData.map((coin, index) => (
                    <li
                      key={index}
                      className="list-group-item text-bg-dark row d-flex"
                    >
                      <div className="col-2">
                        <img
                          className="img-fluid me-2"
                          src={coin.image.thumb}
                          alt={coin.name}
                        />
                      </div>
                      <div className="col-4">
                        <p className="m-0">{coin.name}</p>
                      </div>
                      <div className="col-3">
                        <p className="m-0">{coin.symbol}</p>
                      </div>
                      <div className="col-3">
                        <p className="m-0">
                          ${coin.market_data.current_price.usd}
                        </p>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
