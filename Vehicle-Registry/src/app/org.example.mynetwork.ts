import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
// export namespace org.example.mynetwork{
   export class Vehicle extends Asset {
      vehicleId: string;
      makeAndModel: string;
      registration: string;
      logbookId: string;
      color: string;
      yearOfManufucture: string;
      authority: Authority;
      owner: User;
   }
   export class User extends Participant {
      userId: string;
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber: number;
   }
   export class Authority extends Participant {
      authorityId: string;
      organizationName: string;
      adress: string;
      telephoneNo: number;
   }
   export class Trade extends Transaction {
      vehicle: Vehicle;
      newOwner: User;
      authority: Authority;
   }
// }
