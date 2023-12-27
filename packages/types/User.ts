// import {FirebaseAuthTypes} from '@react-native-firebase/auth';
// import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
// import {PurchasesEntitlementInfo} from 'react-native-purchases';

// intermediate state immediately after signing in before completing tutorial
// export type InitialUserData = {
//   id: FirebaseAuthTypes.User['uid'];
//   email: FirebaseAuthTypes.User['email'];
// };

export type SubscriptionType = 'plus';

// export type Subscription = {
//   originalPurchaseDate: string;
//   type: SubscriptionType;
//   productId: PurchasesEntitlementInfo['productIdentifier'];
// };

export type Handles = {
  instagram?: string;
  tiktok?: string;
  twitter?: string;
  youtube?: string;
};

// export type User = XOR<
//   {
//     dateCreated?: FirebaseFirestoreTypes.FieldValue;
//     dateLastVisited?: FirebaseFirestoreTypes.FieldValue;
//     firstName: string;
//     handles?: Handles;
//     lastName: string;
//     pages?: string[];
//     phone?: string;
//     subscription?: Subscription;
//   } & InitialUserData,
//   InitialUserData
// >;
