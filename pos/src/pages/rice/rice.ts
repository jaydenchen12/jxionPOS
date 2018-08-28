import {Component, ChangeDetectorRef} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {UtilProvider} from "../../providers/util/util";


@Component({
  selector: 'page-rice',
  templateUrl: 'rice.html',
})
export class RicePage {
  importItems: any;
  es = new EventSource(this.util.sseURL);

  constructor(public navCtrl: NavController, public navParams: NavParams, public util: UtilProvider, private ref:ChangeDetectorRef) {
    util.getReq("orderItemList")
      .then((json) => {
        this.importItems = json;
      });
  }

  ionViewDidLoad() {
    this.es.onmessage = (event) => {
      this.importItems = JSON.parse(event.data)[1];
      // setTimeout(function () {
      //   console.log("SSE Triggered")},0);
      this.ref.detectChanges();
      console.log(this.importItems);
    };
    console.log('ionViewDidLoad KitchenPage');
  }

  removeItem(item) {
    // // var index = this.importItems.map(function(x) {return x.orderItemListID; }).indexOf(item.orderItemListID);
    // let index = this.importItems.indexOf(item);
    // if (index > -1) {
    //   this.importItems.splice(index, 1);
    // }
    // else {
    //   console.log("Could not find item:\t", item);
    // }
    let data = {orderID: item.orderItemListID, orderAction: "kitchenDelete"};
    this.util.postReq("orderHistory/action", data);

  }

  changeLanguage() {
    if (!this.util.isChinese) {
      this.util.isChinese = true;
    } else {
      this.util.isChinese = false;
    }
  }

  ngOnDestroy() {
    this.es.close();
    this.ref.detach();
  }
}
