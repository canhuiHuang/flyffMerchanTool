import { Box, Button, Flex, HStack, Spacer, useDisclosure } from '@chakra-ui/react';
import MerchInput from '../../components/MerchInput/MerchInput';
import './Main.scss';
import './MerchInputs.scss';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { saveLocalData } from '../../store/Slices/localDataSlice';
import { RootState } from '../../store/store';
import ItemsManager from '../../components/ItemsManager/ItemsManager';
import { CSVLink, CSVDownload } from 'react-csv';
import Analytics from '../Analytics/Analytics';
import Confirm from '../../components/Modals/Confirm/Confirm';
import { InventoryItem } from '../../utils/types';

type keyName = 'description' | 'itemName' | 'price' | 'amount' | 'date' | 'goalPrice';
type MerchType = 'merchIn' | 'merchOut' | 'items';
interface Item {
  name: string;
  goalPrice: number;
  [propName: string]: any;
}

const Main = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const localData = useSelector((state: RootState) => state.localData);

  const [inventory, setInventory] = useState({
    merchIn: localData.merchIn,
    merchOut: localData.merchOut,
    items: localData.items,
  });

  const save = (type: MerchType, newMerchArray: Array<any>): void => {
    const newInventory = { ...inventory, [type]: [...newMerchArray] };
    setInventory(newInventory);
    dispatch(saveLocalData(newInventory));
  };

  const fixData = () => {
    let newInventory = { ...inventory };

    // Assign id to ALL merchItems
    Object.entries(inventory).forEach(([merchType, merchArray]) => {
      const newMerchArray = merchArray.map((item) => {
        if (!item.id)
          return {
            ...item,
            id: `${Math.ceil(Math.random() * 10000000)}T${Date.now()}`,
          };

        return item;
      });

      newInventory = { ...newInventory, [merchType]: newMerchArray };

      // Close modal
      onClose();
    });

    setInventory(newInventory);
    dispatch(saveLocalData(newInventory));
  };

  const updateMerch = (type: MerchType, index: number, newVal: any, keyName: keyName) => {
    const newMerchArray = [...inventory[type]];
    newMerchArray[index] = { ...newMerchArray[index], [keyName]: newVal };
    save(type, newMerchArray);
  };

  const addMerch = (type: MerchType) => {
    const d = new Date();
    const dateString = [d.getFullYear(), ('0' + (d.getMonth() + 1)).slice(-2), ('0' + d.getDate()).slice(-2)].join('-');

    const newMerchArray = [
      {
        id: `${Math.ceil(Math.random() * 10000000)}T${Date.now()}`,
        description: null,
        itemName: null,
        price: null,
        amount: null,
        date: dateString,
        goalPrice: null,
      },
      ...inventory[type],
    ];

    save(type, newMerchArray);
  };

  const deleteMerch = (type: MerchType, selected: Array<string>) => {
    // Add confirmation modal later //

    const newMerchArray = [...inventory[type]].filter((item) => !selected.includes(item.id));
    save(type, newMerchArray);
  };

  // Merch Mutators
  const addMerchIn = () => addMerch('merchIn');
  const addMerchOut = () => addMerch('merchOut');
  const addItem = () => addMerch('items');

  const updateMerchIn = (index: number, newVal: any, keyName: keyName) =>
    updateMerch('merchIn', index, newVal, keyName);
  const updateMerchOut = (index: number, newVal: any, keyName: keyName) =>
    updateMerch('merchOut', index, newVal, keyName);
  const updateItem = (index: number, newVal: any, keyName: keyName) => updateMerch('items', index, newVal, keyName);

  const deleteMerchIn = (selected: Array<string>) => deleteMerch('merchIn', selected);
  const deleteMerchOut = (selected: Array<string>) => deleteMerch('merchOut', selected);
  const deleteItems = (selected: Array<string>) => deleteMerch('items', selected);

  // Analytics/Inventory Functions
  const inventoryItems = (): Array<InventoryItem> => {
    // Get unique item names
    const uniqueItemNames = [...new Set(inventory.merchIn.map((item) => item.itemName))];
    return uniqueItemNames.map((itemName) => generateInventoryItem(itemName));
  };

  const generateInventoryItem = (itemName: string): InventoryItem => {
    // Free Merch Count
    let freeMerchAmount = 0;

    // Count purchased
    let purchased: number = 0,
      spent: number = 0;
    const sameMerchInArray = inventory.merchIn.filter(
      (merchItem) => merchItem.itemName && merchItem.itemName?.toUpperCase() === itemName?.toUpperCase(),
    );
    sameMerchInArray.forEach((merch) => {
      console.log(merch, merch.price);
      if (Number(merch.price)) purchased += Number(merch.amount);
      else freeMerchAmount += Number(merch.amount);
      spent += Number(merch.amount) * (Number(merch.price) || 0);
    });

    // Count sold && calculate sales
    let sold: number = 0,
      sales: number = 0;
    const sameMerchOutArray = inventory.merchOut.filter(
      (merchItem) => merchItem.itemName && merchItem.itemName?.toUpperCase() === itemName?.toUpperCase(),
    );
    sameMerchOutArray.forEach((merch) => {
      sold += Number(merch.amount);
      sales += Number(merch.amount) * Number(merch.price);
    });

    // Look item on items database
    const databaseItem = inventory.items.filter(
      (item) => item.name && item.name?.toUpperCase() === itemName?.toUpperCase(),
    )[0];

    return {
      name: itemName,
      description: databaseItem?.description,
      purchased,
      sold,
      spent,
      sales,
      freeMerchAmount,
      goalPrice: databaseItem?.goalPrice || 0,
    };
  };

  // useEffect(() => {
  //   const delayDebounceFn = setTimeout(() => {
  //     console.log(inventory);
  //     // Send Axios request here
  //   }, 3000);

  //   return () => clearTimeout(delayDebounceFn);
  // }, [inventory]);

  const csvHeaders = [
    { label: 'description', key: 'description' },
    { label: 'item name', key: 'itemName' },
    { label: 'price', key: 'price' },
    { label: 'amount', key: 'amount' },
    { label: 'date', key: 'date' },
    { label: '-', key: 'separator' },
    { label: 'description', key: 'outDescription' },
    { label: 'item name', key: 'outItemName' },
    { label: 'price', key: 'outPrice' },
    { label: 'amount', key: 'outAmount' },
    { label: 'date', key: 'outDate' },
  ];

  return (
    <Flex className="main-container">
      <Confirm onConfirm={fixData} isOpen={isOpen} onClose={onClose} />

      <HStack>
        <Button className="btn btn-csv" variant="solid" size="sm" mt="1rem">
          <CSVLink
            data={[
              ...inventory.merchIn,
              ...inventory.merchOut.map((merchItem) => ({
                outDescription: merchItem.description,
                outItemName: merchItem.itemName,
                outPrice: merchItem.price,
                outAmount: merchItem.amount,
                outDate: merchItem.date,
              })),
            ]}
            headers={csvHeaders}
            filename="save"
          >
            {t('general.exportCSV')} 📝
          </CSVLink>
        </Button>

        <Spacer />

        <Button className="btn btn-fix" colorScheme="red" variant="solid" size="sm" mt="1rem" onClick={onOpen}>
          {t('general.fixData')}
        </Button>
      </HStack>

      <div className="horizontal">
        <Box className="merch-inputs">
          {inventory && (
            <>
              <MerchInput
                type="in"
                merch={inventory.merchIn}
                updateMerch={updateMerchIn}
                addMerch={addMerchIn}
                deleteMerch={deleteMerchIn}
              />
              <MerchInput
                type="out"
                merch={inventory.merchOut}
                items={inventoryItems()}
                updateMerch={updateMerchOut}
                addMerch={addMerchOut}
                deleteMerch={deleteMerchOut}
              />
            </>
          )}
        </Box>
        <Box>
          <Analytics inventory={inventory} inventoryItems={inventoryItems()} />
        </Box>
      </div>
      <ItemsManager items={inventory.items} updateItem={updateItem} addItem={addItem} deleteItems={deleteItems} />
    </Flex>
  );
};

export default Main;
