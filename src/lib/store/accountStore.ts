import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Address, PaymentMethod } from "../types";

interface AccountState {
  addresses: Address[];
  paymentMethods: PaymentMethod[];
  addAddress: (address: Address) => void;
  updateAddress: (id: string, address: Address) => void;
  removeAddress: (id: string) => void;
  addPaymentMethod: (method: PaymentMethod) => void;
  removePaymentMethod: (id: string) => void;
}

const mockAddresses: Address[] = [
  {
    id: "1",
    label: "Home",
    fullName: "John Doe",
    mobileNumber: "9876543210",
    pinCode: "400001",
    flatHouse: "123 Main St, Apartment 4B",
    areaStreet: "Downtown",
    city: "Mumbai",
    state: "Maharashtra",
    isDefault: true
  }
];

const mockPayments: PaymentMethod[] = [
  { id: "1", type: "card", last4: "4242", expiry: "12/28", isDefault: true }
];

export const useAccountStore = create<AccountState>()(
  persist(
    (set) => ({
      addresses: mockAddresses,
      paymentMethods: mockPayments,
      addAddress: (address) =>
        set((state) => {
          const newAddresses = address.isDefault 
            ? state.addresses.map(a => ({ ...a, isDefault: false })) 
            : state.addresses;
          return { addresses: [...newAddresses, address] };
        }),
      updateAddress: (id, address) =>
        set((state) => {
          let newAddresses = state.addresses;
          if (address.isDefault) {
            newAddresses = newAddresses.map(a => ({ ...a, isDefault: false }));
          }
          return {
            addresses: newAddresses.map((a) => (a.id === id ? address : a)),
          };
        }),
      removeAddress: (id) =>
        set((state) => ({ addresses: state.addresses.filter((a) => a.id !== id) })),
      addPaymentMethod: (method) =>
        set((state) => {
          const newMethods = method.isDefault 
            ? state.paymentMethods.map(m => ({ ...m, isDefault: false })) 
            : state.paymentMethods;
          return { paymentMethods: [...newMethods, method] };
        }),
      removePaymentMethod: (id) =>
        set((state) => ({ paymentMethods: state.paymentMethods.filter((m) => m.id !== id) })),
    }),
    {
      name: "account-storage",
    }
  )
);
