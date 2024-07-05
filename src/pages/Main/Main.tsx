import { Box, Button, Flex } from '@chakra-ui/react';
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
import { Inventory, Items, Merch } from '../../utils/types';

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

  const updateMerch = (type: MerchType, index: number, newVal: any, keyName: keyName) => {
    const newMerchArray = [...inventory[type]];
    newMerchArray[index] = { ...newMerchArray[index], [keyName]: newVal };
    save(type, newMerchArray);
  };

  const addMerch = (type: MerchType) => {
    const d = new Date();

    const newMerchArray = [
      ...inventory[type],
      {
        description: null,
        itemName: null,
        price: null,
        amount: null,
        date: [d.getFullYear(), ('0' + (d.getMonth() + 1)).slice(-2), ('0' + d.getDate()).slice(-2)].join('-'),
        goalPrice: null,
      },
    ];

    save(type, newMerchArray);
  };

  const deleteMerch = (type: MerchType, selected: Array<number>) => {
    // Add confirmation modal later //

    const newMerchArray = [...inventory[type]].filter((item, idx) => !selected.includes(idx));
    save(type, newMerchArray);
  };

  const addMerchIn = () => addMerch('merchIn');
  const addMerchOut = () => addMerch('merchOut');
  const addItem = () => addMerch('items');

  const updateMerchIn = (index: number, newVal: any, keyName: keyName) =>
    updateMerch('merchIn', index, newVal, keyName);
  const updateMerchOut = (index: number, newVal: any, keyName: keyName) =>
    updateMerch('merchOut', index, newVal, keyName);
  const updateItem = (index: number, newVal: any, keyName: keyName) => updateMerch('items', index, newVal, keyName);

  const deleteMerchIn = (selected: Array<number>) => deleteMerch('merchIn', selected);
  const deleteMerchOut = (selected: Array<number>) => deleteMerch('merchOut', selected);
  const deleteItems = (selected: Array<number>) => deleteMerch('items', selected);

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
                items={inventory.items}
                updateMerch={updateMerchOut}
                addMerch={addMerchOut}
                deleteMerch={deleteMerchOut}
              />
            </>
          )}
        </Box>
        <Box>
          <Analytics inventory={inventory} />
        </Box>
      </div>
      <ItemsManager items={inventory.items} updateItem={updateItem} addItem={addItem} deleteItems={deleteItems} />
    </Flex>
  );
};

export default Main;
