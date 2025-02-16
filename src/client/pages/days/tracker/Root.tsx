import { FoodMealItemsList, FoodNutrientsList } from '#/client/entities/food';
import { useEffect, useState } from 'react';
import { DatePicker } from '#/client/components/DatePicker';
import { DateFormat, DateUtils } from '#/shared/models/date';
import { useGetDayQuery, useListFoodMealItemQuery } from '#/client/store';
import { sumNutrients } from '#/shared/models/food';
import { useSearchParams } from 'react-router-dom';
import { Popup } from '#/ui-lib/molecules/Popup';
import { List } from '#/ui-lib/molecules/List';
import { Field } from '#/ui-lib/atoms/Field';
import { Input } from '#/ui-lib/atoms/Input';

const DATE_SEARCH_PARAM = 'date';

export default function Page() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [date, _setDate] = useState<DateFormat>(() => {
    // FIXME validate search param
    return (
      (searchParams.get(DATE_SEARCH_PARAM) as DateFormat) ||
      DateUtils.toDateFormat(new Date())
    );
  });

  const setDate = (newDate?: DateFormat) => {
    const requiredNewDate = newDate || DateUtils.toDateFormat(new Date());

    _setDate(requiredNewDate);

    const newSearchParams = new URLSearchParams();

    if (newDate !== DateUtils.toDateFormat(new Date())) {
      newSearchParams.set(DATE_SEARCH_PARAM, requiredNewDate);
    }

    setSearchParams(newSearchParams);
  };

  const dayQuery = useGetDayQuery(date);
  const listMealItemsQuery = useListFoodMealItemQuery(date);

  const [isItem3Visible, setIsItem3Visible] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setIsItem3Visible(false);
    }, 3000);
  }, []);

  if (!dayQuery.data || !listMealItemsQuery.data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <section style={{ marginBottom: '20px' }}>
        <h1>TEST</h1>
        <Popup>
          <Popup.Trigger>popup</Popup.Trigger>
          <Popup.Content>wow content</Popup.Content>
        </Popup>

        <List>
          <List.Search placeholder="Found items" />
          <List.Empty>No items visible</List.Empty>
          <List.Group>
            <List.Item value="item-1" keywords={['item-1']}>
              Item 1
            </List.Item>
            <List.Item value="item-2" keywords={['item-2']}>
              Item 2
            </List.Item>
            {!!isItem3Visible && (
              <List.Item value="item-3" keywords={['item-3']}>
                Item 3
              </List.Item>
            )}
          </List.Group>
        </List>

        <Field>
          <Field.Label>Label 1</Field.Label>
          <Field.Input>
            <Input />
          </Field.Input>
        </Field>

        <Field direction="row">
          <Field.Label>Label 2</Field.Label>
          <Field.Input>
            <Input />
          </Field.Input>
        </Field>
      </section>

      <DatePicker
        type="single"
        modelValue={date}
        onModelValueChange={v => setDate(v ? v : DateUtils.toDateFormat(new Date()))}
      />

      <section>
        <h2>Еда</h2>

        <FoodNutrientsList
          nutrients={sumNutrients(listMealItemsQuery.data.map(item => item.nutrients))}
        />

        <FoodMealItemsList date={date} />
      </section>
    </div>
  );
}
