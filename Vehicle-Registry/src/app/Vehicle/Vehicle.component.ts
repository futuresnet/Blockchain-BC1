/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { VehicleService } from './Vehicle.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-vehicle',
  templateUrl: './Vehicle.component.html',
  styleUrls: ['./Vehicle.component.css'],
  providers: [VehicleService]
})
export class VehicleComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;

  vehicleId = new FormControl('', Validators.required);
  makeAndModel = new FormControl('', Validators.required);
  registration = new FormControl('', Validators.required);
  logbookId = new FormControl('', Validators.required);
  color = new FormControl('', Validators.required);
  yearOfManufucture = new FormControl('', Validators.required);
  authority = new FormControl('', Validators.required);
  owner = new FormControl('', Validators.required);

  constructor(public serviceVehicle: VehicleService, fb: FormBuilder) {
    this.myForm = fb.group({
      vehicleId: this.vehicleId,
      makeAndModel: this.makeAndModel,
      registration: this.registration,
      logbookId: this.logbookId,
      color: this.color,
      yearOfManufucture: this.yearOfManufucture,
      authority: this.authority,
      owner: this.owner
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceVehicle.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(asset => {
        tempList.push(asset);
      });
      this.allAssets = tempList;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the asset field to update
   * @param {any} value - the enumeration value for which to toggle the checked state
   */
  changeArrayValue(name: string, value: any): void {
    const index = this[name].value.indexOf(value);
    if (index === -1) {
      this[name].value.push(value);
    } else {
      this[name].value.splice(index, 1);
    }
  }

	/**
	 * Checkbox helper, determining whether an enumeration value should be selected or not (for array enumeration values
   * only). This is used for checkboxes in the asset updateDialog.
   * @param {String} name - the name of the asset field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified asset field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.example.mynetwork.Vehicle',
      'vehicleId': this.vehicleId.value,
      'makeAndModel': this.makeAndModel.value,
      'registration': this.registration.value,
      'logbookId': this.logbookId.value,
      'color': this.color.value,
      'yearOfManufucture': this.yearOfManufucture.value,
      'authority': this.authority.value,
      'owner': this.owner.value
    };

    this.myForm.setValue({
      'vehicleId': null,
      'makeAndModel': null,
      'registration': null,
      'logbookId': null,
      'color': null,
      'yearOfManufucture': null,
      'authority': null,
      'owner': null
    });

    return this.serviceVehicle.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'vehicleId': null,
        'makeAndModel': null,
        'registration': null,
        'logbookId': null,
        'color': null,
        'yearOfManufucture': null,
        'authority': null,
        'owner': null
      });
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
          this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
          this.errorMessage = error;
      }
    });
  }


  updateAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.example.mynetwork.Vehicle',
      'makeAndModel': this.makeAndModel.value,
      'registration': this.registration.value,
      'logbookId': this.logbookId.value,
      'color': this.color.value,
      'yearOfManufucture': this.yearOfManufucture.value,
      'authority': this.authority.value,
      'owner': this.owner.value
    };

    return this.serviceVehicle.updateAsset(form.get('vehicleId').value, this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }


  deleteAsset(): Promise<any> {

    return this.serviceVehicle.deleteAsset(this.currentId)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  setId(id: any): void {
    this.currentId = id;
  }

  getForm(id: any): Promise<any> {

    return this.serviceVehicle.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'vehicleId': null,
        'makeAndModel': null,
        'registration': null,
        'logbookId': null,
        'color': null,
        'yearOfManufucture': null,
        'authority': null,
        'owner': null
      };

      if (result.vehicleId) {
        formObject.vehicleId = result.vehicleId;
      } else {
        formObject.vehicleId = null;
      }

      if (result.makeAndModel) {
        formObject.makeAndModel = result.makeAndModel;
      } else {
        formObject.makeAndModel = null;
      }

      if (result.registration) {
        formObject.registration = result.registration;
      } else {
        formObject.registration = null;
      }

      if (result.logbookId) {
        formObject.logbookId = result.logbookId;
      } else {
        formObject.logbookId = null;
      }

      if (result.color) {
        formObject.color = result.color;
      } else {
        formObject.color = null;
      }

      if (result.yearOfManufucture) {
        formObject.yearOfManufucture = result.yearOfManufucture;
      } else {
        formObject.yearOfManufucture = null;
      }

      if (result.authority) {
        formObject.authority = result.authority;
      } else {
        formObject.authority = null;
      }

      if (result.owner) {
        formObject.owner = result.owner;
      } else {
        formObject.owner = null;
      }

      this.myForm.setValue(formObject);

    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  resetForm(): void {
    this.myForm.setValue({
      'vehicleId': null,
      'makeAndModel': null,
      'registration': null,
      'logbookId': null,
      'color': null,
      'yearOfManufucture': null,
      'authority': null,
      'owner': null
      });
  }

}
