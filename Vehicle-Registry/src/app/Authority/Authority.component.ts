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
import { AuthorityService } from './Authority.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-authority',
  templateUrl: './Authority.component.html',
  styleUrls: ['./Authority.component.css'],
  providers: [AuthorityService]
})
export class AuthorityComponent implements OnInit {

  myForm: FormGroup;

  private allParticipants;
  private participant;
  private currentId;
  private errorMessage;

  authorityId = new FormControl('', Validators.required);
  organizationName = new FormControl('', Validators.required);
  adress = new FormControl('', Validators.required);
  telephoneNo = new FormControl('', Validators.required);


  constructor(public serviceAuthority: AuthorityService, fb: FormBuilder) {
    this.myForm = fb.group({
      authorityId: this.authorityId,
      organizationName: this.organizationName,
      adress: this.adress,
      telephoneNo: this.telephoneNo
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceAuthority.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(participant => {
        tempList.push(participant);
      });
      this.allParticipants = tempList;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
        this.errorMessage = error;
      }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the participant field to update
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
   * only). This is used for checkboxes in the participant updateDialog.
   * @param {String} name - the name of the participant field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified participant field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addParticipant(form: any): Promise<any> {
    this.participant = {
      $class: 'org.example.mynetwork.Authority',
      'authorityId': this.authorityId.value,
      'organizationName': this.organizationName.value,
      'adress': this.adress.value,
      'telephoneNo': this.telephoneNo.value
    };

    this.myForm.setValue({
      'authorityId': null,
      'organizationName': null,
      'adress': null,
      'telephoneNo': null
    });

    return this.serviceAuthority.addParticipant(this.participant)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'authorityId': null,
        'organizationName': null,
        'adress': null,
        'telephoneNo': null
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


   updateParticipant(form: any): Promise<any> {
    this.participant = {
      $class: 'org.example.mynetwork.Authority',
      'organizationName': this.organizationName.value,
      'adress': this.adress.value,
      'telephoneNo': this.telephoneNo.value
    };

    return this.serviceAuthority.updateParticipant(form.get('authorityId').value, this.participant)
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


  deleteParticipant(): Promise<any> {

    return this.serviceAuthority.deleteParticipant(this.currentId)
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

    return this.serviceAuthority.getparticipant(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'authorityId': null,
        'organizationName': null,
        'adress': null,
        'telephoneNo': null
      };

      if (result.authorityId) {
        formObject.authorityId = result.authorityId;
      } else {
        formObject.authorityId = null;
      }

      if (result.organizationName) {
        formObject.organizationName = result.organizationName;
      } else {
        formObject.organizationName = null;
      }

      if (result.adress) {
        formObject.adress = result.adress;
      } else {
        formObject.adress = null;
      }

      if (result.telephoneNo) {
        formObject.telephoneNo = result.telephoneNo;
      } else {
        formObject.telephoneNo = null;
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
      'authorityId': null,
      'organizationName': null,
      'adress': null,
      'telephoneNo': null
    });
  }
}
