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
import { Items, Item, Inventory, Merch, InventoryItem } from '../../utils/types';
import { useTranslation } from 'react-i18next';

import './Analytics.scss';

interface Props {
  inventory: Inventory;
  inventoryItems: Array<InventoryItem>;
}

const Analytics = ({ inventory: { merchIn, merchOut }, inventoryItems }: Props) => {
  const { t } = useTranslation();

  const totalSales = (): number => {
    let penya: number = 0;
    inventoryItems.forEach((item) => {
      penya += Number(item.sales);
    });
    return penya;
  };

  const totalSpent = (): number => {
    let penya: number = 0;
    inventoryItems.forEach((item) => {
      penya += Number(item.spent);
    });
    return penya;
  };

  const expectedTotalSales = (): number => {
    let penya: number = 0;
    inventoryItems.forEach((item) => {
      penya += Number(item.goalPrice) * Number(item.purchased);
    });
    return penya;
  };

  const estimatedTotalEarningsFromFreeMerch = (): number => {
    let penya: number = 0;
    inventoryItems.forEach((item) => {
      penya += computed.estimatedEarningsFromFreeMerch(item);
    });
    return penya;
  };

  const ratioClassification = (ratio: string): string => {
    const ratioNumber = Number(ratio);
    if (ratioNumber >= 100 || ratio === '∞') return 'very-high';
    if (ratioNumber >= 80) return 'high';
    if (ratioNumber >= 50) return 'half';
    if (ratioNumber >= 20) return 'low';
    return 'very-low';
  };

  const getRatio = (ratio: number): string => {
    if (ratio === Infinity) return '∞';
    return `${Math.ceil(ratio * 100) || 0}%`;
  };

  const computed = {
    expectedSales: (item: InventoryItem) => (item.purchased + item.freeMerchAmount) * (item.goalPrice || 0),
    expectedEarnings: (item: InventoryItem) => computed.expectedSales(item) - item.spent,
    expectedTotalEarnings: (): number => expectedTotalSales() - totalSpent(),
    totalEarnings: (): number => totalSales() - totalSpent(),
    estimatedEarningsFromFreeMerch: (item: InventoryItem): number => {
      if (Number(item.freeMerchAmount) > Number(item.sold)) {
        return Number(item.goalPrice) * Number(item.sold);
      }
      return Number(item.goalPrice) * Number(item.freeMerchAmount);
    },
  };

  return (
    <Box className="analytics-container">
      <Box className="earnings-row">
        {/* Earnings */}
        <Box className="summary earnings">
          <Stat>
            <StatLabel>{t('general.earnings')}</StatLabel>
            <StatNumber className={`${computed.totalEarnings() >= 0 ? 'positive' : 'negative'}`}>
              <StatArrow type={computed.totalEarnings() >= 0 ? 'increase' : 'decrease'} />{' '}
              {formatValue({
                value: computed.totalEarnings().toString(),
                prefix: '$',
              })}
            </StatNumber>
          </Stat>

          <p className="estimated-earnings-from-free-merch">
            {t('components.analytics.estimatedEarningsFromFreeMerch')}:{' '}
            <b className="positive">
              {formatValue({
                value: estimatedTotalEarningsFromFreeMerch().toString(),
                prefix: '$',
              })}
            </b>
          </p>
          <p className="expected-total-earnings">
            {t('components.analytics.expectedTotalEarnings')}:{' '}
            <b className="gold">
              {formatValue({
                value: computed.expectedTotalEarnings().toString(),
                prefix: '$',
              })}
            </b>
          </p>
        </Box>
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

      {/* Expected Sales */}
      <Box className="expected-sales">
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

      <Box className="inventory" mt={6}>
        <h2>{t('general.inventory')}</h2>
        <TableContainer className="table">
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>{t('fields.title.itemName')}</Th>
                {/* <Th>{t('fields.title.description')}</Th> */}
                <Th>{t('fields.title.goalPrice')}</Th>
                <Th>{t('components.analytics.free')}</Th>
                <Th>{t('components.analytics.purchased')}</Th>
                <Th>{t('fields.title.available')}</Th>
                <Th>{t('components.analytics.sold')}</Th>
                <Th>{t('fields.title.saleOverSpent')}</Th>
                <Th>{t('fields.title.expectedSales')}</Th>
                <Th>{t('fields.title.expectedEarnings')}</Th>
                <Th>{t('fields.title.earnings')}</Th>
              </Tr>
            </Thead>
            <Tbody>
              {!!inventoryItems.length &&
                inventoryItems.map((item, idx) => (
                  <Tr key={idx} className="highlightable">
                    {/* Name */}
                    <Td>{item.name}</Td>

                    {/* Description */}
                    {/* <Td>{item.description}</Td> */}

                    {/* Goal Price */}
                    <Td>{formatValue({ value: item.goalPrice?.toString(), prefix: '$' })}</Td>

                    {/* Free */}
                    <Td>{item.freeMerchAmount}</Td>

                    {/* Purchased */}
                    <Td>{item.purchased}</Td>

                    {/* Available */}
                    <Td>{item.freeMerchAmount + item.purchased - item.sold}</Td>

                    {/* Sold */}
                    <Td
                      className={`align-center availability-ratio ratio ${ratioClassification(
                        getRatio(item.sold / item.purchased),
                      )}`}
                    >
                      {item.sold} ({getRatio(item.sold / (item.freeMerchAmount + item.purchased - item.sold))})
                    </Td>

                    {/* Sales / Spent */}
                    <Td
                      className={`align-center earnings-ratio ratio ${ratioClassification(
                        getRatio(item.sales / item.spent),
                      )}`}
                    >
                      {formatValue({ value: item.sales.toString(), prefix: '$' })} /{' '}
                      {formatValue({ value: item.spent.toString(), prefix: '$' })} ({getRatio(item.sales / item.spent)})
                    </Td>

                    {/* Expected Sales */}
                    <Td className={`${computed.expectedSales(item) <= 0 ? 'error' : ''}`}>
                      {computed.expectedSales(item) > 0 && (
                        <span>
                          {formatValue({
                            value: computed.expectedSales(item).toString(),
                            prefix: '$',
                          })}
                        </span>
                      )}

                      {computed.expectedSales(item) <= 0 && (
                        <Tooltip hasArrow label={t('components.analytics.unexpectedSalesMessage', { name: item.name })}>
                          {formatValue({
                            value: computed.expectedSales(item).toString(),
                            prefix: '$',
                          })}
                        </Tooltip>
                      )}
                    </Td>

                    {/* Expected Earnings */}
                    <Td className={`${computed.expectedEarnings(item) < 0 ? 'error' : ''}`}>
                      {computed.expectedEarnings(item) > 0 && (
                        <span>
                          {formatValue({
                            value: computed.expectedEarnings(item).toString(),
                            prefix: '$',
                          })}
                        </span>
                      )}

                      {computed.expectedEarnings(item) <= 0 && (
                        <Tooltip
                          hasArrow
                          label={t('components.analytics.unexpectedEarningsMessage', { name: item.name })}
                        >
                          {formatValue({
                            value: computed.expectedEarnings(item).toString(),
                            prefix: '$',
                          })}
                        </Tooltip>
                      )}
                    </Td>

                    {/* Earnings */}
                    <Td className={`${item.sales - item.spent > 0 ? 'good' : 'bad'}`}>
                      {formatValue({
                        value: (item.sales - item.spent).toString(),
                        prefix: '$',
                      })}{' '}
                      {item.sales - item.spent > 0 &&
                        item.sales - item.spent >= computed.expectedEarnings(item) &&
                        '🎉'}
                      {/* {item.sales - item.spent > 0 && item.sales - item.spent >= computed.expectedEarnings(item) && (
                        <Tooltip hasArrow label={t('components.analytics.surpassedExpectedEarnings')}>🎉</Tooltip>
                      )} */}
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
