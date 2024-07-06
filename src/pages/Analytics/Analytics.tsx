import {
  Box,
  Stat,
  StatArrow,
  StatGroup,
  StatHelpText,
  StatLabel,
  StatNumber,
  TableCaption,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer } from '@chakra-ui/react';
import { formatValue } from 'react-currency-input-field';
import { Items, Item, Inventory, Merch } from '../../utils/types';
import { useTranslation } from 'react-i18next';

import './Analytics.scss';

interface Props {
  inventory: Inventory;
}

interface InventoryItem {
  name: string;
  description?: string;
  purchased: number;
  sold: number;
  spent: number;
  sales: number;
  goalPrice?: number;
}

const Analytics = ({ inventory: { merchIn, merchOut, items } }: Props) => {
  const { t } = useTranslation();

  const inventoryItems = (): Array<InventoryItem> => {
    // Get unique item names
    const uniqueItemNames = [...new Set(merchIn.map((item) => item.itemName))];
    return uniqueItemNames.map((itemName) => generateInventoryItem(itemName));
  };

  const generateInventoryItem = (itemName: string): InventoryItem => {
    // Count purchased
    let purchased: number = 0,
      spent: number = 0;
    const sameMerchInArray = merchIn.filter((merchItem) => merchItem.itemName.toUpperCase() === itemName.toUpperCase());
    sameMerchInArray.forEach((merch) => {
      purchased += Number(merch.amount);
      spent += Number(merch.amount) * Number(merch.price);
    });

    // Count sold && calculate sales
    let sold: number = 0,
      sales: number = 0;
    const sameMerchOutArray = merchOut.filter(
      (merchItem) => merchItem.itemName.toUpperCase() === itemName.toUpperCase(),
    );
    sameMerchOutArray.forEach((merch) => {
      sold += Number(merch.amount);
      sales += Number(merch.amount) * Number(merch.price);
    });

    // Look item on items database
    const databaseItem = items.filter((item) => item.name?.toUpperCase() === itemName?.toUpperCase())[0];

    return {
      name: itemName,
      description: databaseItem?.description,
      purchased,
      sold,
      spent,
      sales,
      goalPrice: databaseItem?.goalPrice || 0,
    };
  };

  const totalSales = (): number => {
    let penya: number = 0;
    inventoryItems().forEach((item) => {
      penya += Number(item.sales);
    });
    return penya;
  };

  const totalSpent = (): number => {
    let penya: number = 0;
    inventoryItems().forEach((item) => {
      penya += Number(item.spent);
    });
    return penya;
  };

  const expectedTotalSales = (): number => {
    let penya: number = 0;
    inventoryItems().forEach((item) => {
      penya += Number(item.goalPrice) * Number(item.purchased);
    });
    return penya;
  };

  const totalEarnings = (): number => totalSales() - totalSpent();
  const expectedTotalEarnings = (): number => expectedTotalSales() - totalSpent();

  const ratioClassification = (ratio: number): string => {
    if (ratio >= 100) return 'very-high';
    if (ratio >= 80) return 'high';
    if (ratio >= 50) return 'half';
    if (ratio >= 20) return 'low';
    return 'very-low';
  };

  return (
    <Box className="analytics-container">
      <Box className="summary earnings">
        <Stat>
          <StatLabel>{t('general.earnings')}</StatLabel>
          <StatNumber className={`${totalEarnings() >= 0 ? 'positive' : 'negative'}`}>
            <StatArrow type={totalEarnings() >= 0 ? 'increase' : 'decrease'} />{' '}
            {formatValue({
              value: totalEarnings().toString(),
              prefix: '$',
            })}
          </StatNumber>
        </Stat>
        <p className="expected-total-earnings">
          {t('general.expectedTotalEarnings')}:{' '}
          <b className="gold">
            {formatValue({
              value: expectedTotalEarnings().toString(),
              prefix: '$',
            })}
          </b>
        </p>
      </Box>
      <Box className="summary sales">
        <Box>
          <Stat>
            <StatLabel>
              <StatArrow type="increase" />
              {t('general.sales')}
            </StatLabel>
            <StatNumber>
              {formatValue({
                value: totalSales().toString(),
                prefix: '$',
              })}
            </StatNumber>
          </Stat>

          <p className="expected-total-sales">
            {t('general.expectedSales')}:{' '}
            <b className="gold">
              {formatValue({
                value: expectedTotalSales().toString(),
                prefix: '$',
              })}
            </b>
          </p>
        </Box>

        <Stat>
          <StatLabel>
            <StatArrow type="decrease" />
            {t('general.spent')}
          </StatLabel>
          <StatNumber>
            {formatValue({
              value: totalSpent().toString(),
              prefix: '$',
            })}
          </StatNumber>
        </Stat>
      </Box>

      <Box className="inventory" mt={6}>
        <h2>{t('general.inventory')}</h2>
        <TableContainer className="table">
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>{t('fields.title.itemName')}</Th>
                {/* <Th>{t('fields.title.description')}</Th> */}
                <Th>{t('fields.title.goalPrice')}</Th>
                <Th>{t('fields.title.soldOverPurchased')}</Th>
                <Th>{t('fields.title.available')}</Th>
                <Th>{t('fields.title.saleOverSpent')}</Th>
                <Th>{t('fields.title.expectedSales')}</Th>
                <Th>{t('fields.title.earnings')}</Th>
                <Th>{t('fields.title.expectedEarnings')}</Th>
              </Tr>
            </Thead>
            <Tbody>
              {!!inventoryItems().length &&
                inventoryItems().map((item, idx) => (
                  <Tr key={idx}>
                    {/* Name */}
                    <Td>{item.name}</Td>

                    {/* Description */}
                    {/* <Td>{item.description}</Td> */}

                    {/* Goal Price */}
                    <Td>{formatValue({ value: item.goalPrice?.toString(), prefix: '$' })}</Td>

                    {/* Sold / Purchased */}
                    <Td
                      className={`align-center availability-ratio ratio ${ratioClassification(
                        Math.ceil((item.sold / item.purchased) * 100),
                      )}`}
                    >
                      {item.sold} / {item.purchased} ({Math.ceil((item.sold / item.purchased) * 100)}%)
                    </Td>

                    {/* Available */}
                    <Td>{item.purchased - item.sold}</Td>

                    {/* Sales / Spent */}
                    <Td
                      className={`align-center earnings-ratio ratio ${ratioClassification(
                        Math.ceil((item.sales / item.spent) * 100),
                      )}`}
                    >
                      {formatValue({ value: item.sales.toString(), prefix: '$' })} /{' '}
                      {formatValue({ value: item.spent.toString(), prefix: '$' })} (
                      {Math.ceil((item.sales / item.spent) * 100)}%)
                    </Td>

                    {/* Expected Sales */}
                    <Td>{formatValue({ value: (item.purchased * (item.goalPrice || 0)).toString(), prefix: '$' })} </Td>

                    {/* Earnings */}
                    <Td className={`${item.sales - item.spent > 0 ? 'good' : 'bad'}`}>
                      {formatValue({
                        value: (item.sales - item.spent).toString(),
                        prefix: '$',
                      })}{' '}
                      {item.sales - item.spent - item.purchased * (item.goalPrice || 0) >= 0 && '🎉'}
                    </Td>

                    {/* Expected Earnings */}
                    <Td
                      className={`${item.purchased * (item.goalPrice || 0) - item.spent > 0 ? 'good' : ''} ${
                        item.purchased * (item.goalPrice || 0) - item.spent < 0 ? 'error' : ''
                      }`}
                    >
                      {item.purchased * (item.goalPrice || 0) - item.spent >= 0 && (
                        <span>
                          {' '}
                          {formatValue({
                            value: (item.purchased * (item.goalPrice || 0) - item.spent).toString(),
                            prefix: '$',
                          })}
                        </span>
                      )}

                      {item.purchased * (item.goalPrice || 0) - item.spent < 0 && (
                        <Tooltip label={t('general.unexpectedEarningsMessage')}>
                          {formatValue({
                            value: (item.purchased * (item.goalPrice || 0) - item.spent).toString(),
                            prefix: '$',
                          })}
                        </Tooltip>
                      )}
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default Analytics;
