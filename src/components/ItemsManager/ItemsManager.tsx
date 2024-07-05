import {
  Box,
  Checkbox,
  Collapse,
  Editable,
  EditableInput,
  EditablePreview,
  Input,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer } from '@chakra-ui/react';
import CurrencyInput from 'react-currency-input-field';
import { formatValue } from 'react-currency-input-field';
import { Button } from '@chakra-ui/react';
import { Items, Item } from '../../utils/types';
import { useTranslation } from 'react-i18next';
import { RootState } from '../../store/store';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';

import './ItemsManager.scss';
import { saveLocalData } from '../../store/Slices/localDataSlice';

const ItemsManager = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { isOpen, onToggle } = useDisclosure();
  const [selected, setSelected] = useState<Array<number>>([]);
  const onSelectHandle = (newVal: boolean, itemIndex: number) => {
    if (newVal) {
      if (!selected.includes(itemIndex)) setSelected([...selected, itemIndex]);
    } else {
      setSelected(selected.filter((item) => item !== itemIndex));
    }
  };

  const localData = useSelector((state: RootState) => state.localData);
  const [items, setItems] = useState([...localData.items]);
  const updateItem = (index: number, newVal: any, keyName: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [keyName]: newVal };
    setItems(newItems);
    dispatch(saveLocalData({ items: newItems }));
  };
  const addItem = () => {
    const newItems = [...items, {}];
    setItems(newItems);
    dispatch(saveLocalData({ items: newItems }));
  };
  const onDeleteHandler = () => {
    // Add confirmation modal later
    const newItems = items.filter((item, idx) => !selected.includes(idx));
    setItems(newItems);
    dispatch(saveLocalData({ items: newItems }));
    setSelected([]);
  };

  return (
    <Box className="items-manager-interface">
      <Button className="btn-item-manager-toggle" variant="outline" size="sm" onClick={onToggle} mt="1rem">
        {t('general.itemsDatabase')}
      </Button>

      <Collapse in={isOpen} transition={{ exit: { delay: 0.02 }, enter: { duration: 0.1 } }}>
        <Box className="items-manager-container" boxShadow="inner" p="6" rounded="md">
          <Box className="items-manager">
            <Collapse in={!!selected.length} animateOpacity>
              <Box className="actions" mb="1rem">
                <p>{t('general.selectedItems', { amount: selected.length })}</p>
                <Stack>
                  <Button colorScheme="red" variant="outline" w="120px" size="sm" onClick={onDeleteHandler}>
                    🗑️ {t('general.delete')}
                  </Button>
                </Stack>
              </Box>
            </Collapse>

            {!!items.length && (
              <TableContainer className="merch-table table">
                <Table size="sm">
                  <Thead>
                    <Tr>
                      <Th>{t('fields.title.itemName')}</Th>
                      <Th>{t('fields.title.description')}</Th>
                      <Th>{t('fields.title.goalPrice')}</Th>
                      <Th className="selection">{/* t('general.selection') */}</Th>
                      {/* <Th>{t('general.amountBought')}</Th>
            <Th>{t('general.amountSold')}</Th>
            <Th>{t('general.spent')}</Th>
            <Th>{t('general.earnings')}</Th> */}
                    </Tr>
                  </Thead>
                  <Tbody>
                    {items.map((item, idx) => (
                      <Tr key={idx}>
                        <Td>
                          <Editable defaultValue={item.name || undefined}>
                            <EditablePreview />
                            <EditableInput
                              value={item.name}
                              onChange={(e) => updateItem(idx, e.target.value, 'name')}
                            />
                          </Editable>
                        </Td>
                        <Td>
                          <Editable defaultValue={item.description || undefined}>
                            <EditablePreview />
                            <EditableInput
                              value={item.description}
                              onChange={(e) => updateItem(idx, e.target.value, 'description')}
                            />
                          </Editable>
                        </Td>
                        <Td className="price">
                          <Editable>
                            <CurrencyInput
                              name="goalPrice"
                              placeholder=""
                              prefix="$"
                              defaultValue={item.goalPrice}
                              decimalsLimit={0}
                              onValueChange={(value, name, values) => updateItem(idx, value, 'goalPrice')}
                            />
                            <Input as={EditableInput} />
                          </Editable>
                        </Td>
                        <Td className="selection">
                          <Checkbox
                            onChange={(e) => onSelectHandle(e.target.checked, idx)}
                            colorScheme="red"
                            checked={selected.includes(idx)}
                          ></Checkbox>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            )}

            <Box className="add-new" mt={3}>
              <Button colorScheme="blue" size="sm" variant="outline" onClick={() => addItem()}>
                {t('general.addNewItem')}
              </Button>
            </Box>
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
};

export default ItemsManager;
