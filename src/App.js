import React, { Component } from "react";
import accounting from "accounting";
import "./App.css";
import "../node_modules/react-vis/dist/style.css";
import {
  XYPlot,
  LineSeries,
  VerticalGridLines,
  HorizontalGridLines,
  XAxis,
  YAxis
} from "react-vis";

class App extends Component {
  constructor() {
    super();
    let start = 25000;
    let monthly = 750;
    let years = 15;
    let months = years * 12;
    let targetInterest = 0.15;
    let annualInterest = null;
    let monthlyIncrease = annualInterest / 12;
    let reinvestShare = 0.33;

    let total = start;
    let data = [];
    let safeMoneyData = [];

    let safeMoney = 0;
    let safeMoneyInterest = 0.03;
    let safeMoneyInterestMonthly = safeMoneyInterest / 12;

    let yearlyGrowth = [
      0.04,
      0.17,
      0.7,
      -0.012,
      -0.2,
      -0.4,
      0.3,
      0.17,
      0.3,
      0.2,
      -0.057,
      -0.38,
      0.43,
      0.2,
      -0.14,
      0.11,
      0.2,
      0.1,
      -0.012,
      0.05,
      0.04,
      0.04,
      0.17,
      0.7,
      -0.012,
      -0.2,
      -0.4,
      0.3,
      0.17,
      0.3,
      0.2,
      -0.057,
      -0.38,
      0.43,
      0.2,
      -0.14,
      0.11,
      0.2,
      0.1,
      -0.012,
      0.05,
      0.04,
        0.3
    ];

    for (let i = 0; i < months; i++) {
      let isNewYear = i % 12 === 0;

      if (isNewYear) {
        if (annualInterest) {
          if (annualInterest > targetInterest) {
            let happyInterest =
              (annualInterest - targetInterest) * reinvestShare;
            let investInSafeBonds = total * happyInterest;

            safeMoney += investInSafeBonds;
            total -= investInSafeBonds;
          }
        }
        annualInterest = yearlyGrowth.pop();
        monthlyIncrease = annualInterest / 12;
      }

      total = total + total * monthlyIncrease + monthly;
      safeMoney = safeMoney + safeMoney * safeMoneyInterestMonthly;
      data.push({
        x: i,
        y: total
      });

      safeMoneyData.push({
        x: i,
        y: safeMoney
      });
    }

    this.state = {
      data,
      safeMoneyData,
      start,
      monthly,
      targetInterest,
      safeMoneyInterest,
      reinvestShare
    };

    this.getRows = this.getRows.bind(this);
  }

  render() {

    //let stockTotal = parseInt(this.state.data[this.state.data.length - 1].y);
    return (
      <div className="App">
        <XYPlot height={300} width={900}>
          <YAxis />
          <LineSeries data={this.state.data} />
          <LineSeries data={this.state.safeMoneyData} />
          <VerticalGridLines />
          <HorizontalGridLines />
          <XAxis />
        </XYPlot>

        <div className="info">
          Du startar år 0 med {accounting.formatNumber(this.state.start)} kr. Du
          sparar {accounting.formatNumber(this.state.monthly)} kr varje månad.
          Din målsättning är att aktier ska växa{" "}
          {this.state.targetInterest * 100}% per år. Om de växer med mer än det
          så tar du {this.state.reinvestShare * 100}% av överskottsvinsten och återinvesterar i en "säker"
          fond med en årlig avkastning på {this.state.safeMoneyInterest * 100}%
          <p>
            <small>
              * Årlig aktietillväxt är historiska siffror för börsens tillväxt1
            </small>
          </p>
        </div>

        <table>
          <thead>
            <tr>
              <th>År</th>
              <th>Säkert</th>
              <th>Aktier</th>
              <th>Totalt</th>
            </tr>
          </thead>
          <tbody>{this.getRows()}</tbody>
        </table>
      </div>
    );
  }

  getRows() {
    let year = 0;
    let lastSafe = null;
    let lastStock = null;
    let lastTotal = null;
    return this.state.data.map((currentStockValue, index) => {
      let isNewYear = index % 12 === 0;
      if (isNewYear) {
        year++;
        let safe = this.state.safeMoneyData[index].y;
        let stock = currentStockValue.y;

        let safeDiff = 0;
        let stockDiff = 0;
        let totalDiff = 0;
        if (lastSafe || lastStock) {
          safeDiff = safe - lastSafe;
          stockDiff = stock - lastStock;
          totalDiff = safe + stock - lastTotal;
        }

        lastSafe = safe;
        lastStock = stock;
        lastTotal = lastSafe + lastStock;

        let diffPercentage = null;
        if (totalDiff !== 0) {
            let diff = totalDiff;
            let myTotal = safe + stock;
            diffPercentage = (diff / myTotal) * 100;
        }


        return (
          <tr key={index}>
            <td>{year}</td>
            <td>
              {accounting.formatNumber(safe)}
              <br />
              <small>{accounting.formatNumber(safeDiff)}</small>
            </td>
            <td>
              {accounting.formatNumber(stock)}
              <br />
              <small>{accounting.formatNumber(stockDiff)}</small>
            </td>
            <td>
              {accounting.formatNumber(safe + stock)}
              <br />
              <small>{accounting.formatNumber(totalDiff)}<br/>{accounting.toFixed(diffPercentage, 2)}</small>
            </td>
          </tr>
        );
      }
      return null;
    });
  }
}

export default App;
