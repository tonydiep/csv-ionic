import { Component } from '@angular/core';
import { Http } from '@angular/http';
import * as papa from 'papaparse';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  csvData: any[] = [];
  headerRow: any[] = [];

  constructor(public navCtrl: NavController, private http: Http) {
    this.readCsvData();
  }

  fileLocation = 'assets/dummyData.csv';

  private readCsvData() {
    this.http.get(this.fileLocation)
      .subscribe(
      data => this.extractData(data),
      err => this.handleError(err)
      );
  }

  private extractData(res) {
    let csvData = res['_body'] || '';
    let parsedData = papa.parse(csvData).data;
 
    this.headerRow = parsedData[0];
 
    parsedData.splice(0, 1);
    this.csvData = parsedData;
  }
  
  downloadCSV() {
    let csv = papa.unparse({
      fields: this.headerRow,
      data: this.csvData
    });
 
    // Dummy implementation for Desktop download purpose
    var blob = new Blob([csv]);
    var a = window.document.createElement("a");
    a.href = window.URL.createObjectURL(blob);
    a.download = "newdata.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
 
  private handleError(err) {
    console.log('something went wrong: ', err);
  }
 
  /**
   * Kludge to ensure each item is uniquely identified
   * See https://stackoverflow.com/questions/42322968/angular2-dynamic-input-field-lose-focus-when-input-changes
   * 
   * @param index 
   * @param item 
   */
  trackByFn(index: any, item: any) {
    return index;
  }
    
}
