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
import { Item } from '../../utils/types';
import { useTranslation } from 'react-i18next';

import { useState } from 'react';

import './ItemsManager.scss';

interface Props {
  items: Array<Item>;
  updateItem: Function;
  addItem: Function;
  deleteItems: Function;
}

const ItemsManager = ({ items, updateItem, addItem, deleteItems }: Props) => {
  const { t } = useTranslation();

  const { isOpen, onToggle } = useDisclosure();
  const [selected, setSelected] = useState<Array<string>>([]);
  const onSelectHandle = (newVal: boolean, itemId: string) => {
    if (newVal) {
      if (!selected.includes(itemId)) setSelected([...selected, itemId]);
    } else {
      setSelected(selected.filter((selectedId) => selectedId !== itemId));
    }
  };

  const onDeleteHandler = () => {
    // Add confirmation modal later //
    deleteItems(selected);
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
            <Box className="add-new" mt={3}>
              <Button colorScheme="blue" size="sm" mb="2" variant="outline" onClick={() => addItem()}>
                {t('general.addNewItem')}
              </Button>
            </Box>
            {!!items.length && (
              <TableContainer className="merch-table table">
                <Table size="sm">
                  <Thead>
                    <Tr>
                      <Th>{t('fields.title.itemName')}</Th>
                      <Th>{t('fields.title.description')}</Th>
                      <Th>{t('fields.title.goalPrice')}</Th>
                      <Th className="selection">{/* t('general.selection') */}</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {items.map((item, idx) => (
                      <Tr key={item.id || idx} className={`${item.id ? 'has-id' : 'no-id'} highlightable`}>
                        <Td>
                          <Editable defaultValue={item.name || undefined}>
                            <EditablePreview />
                            <EditableInput value={item.name} onBlur={(e) => updateItem(idx, e.target.value, 'name')} />
                          </Editable>
                        </Td>
                        <Td>
                          <Editable defaultValue={item.description || undefined}>
                            <EditablePreview />
                            <EditableInput
                              value={item.description}
                              onBlur={(e) => updateItem(idx, e.target.value, 'description')}
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
                            onChange={(e) => onSelectHandle(e.target.checked, item.id)}
                            colorScheme="red"
                            checked={selected.includes(item.id)}
                          ></Checkbox>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
};

export default ItemsManager;
