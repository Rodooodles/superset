/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import { render } from 'spec/helpers/testing-library';
import { renderResultCell } from './utils';

jest.mock('src/components/JsonModal', () => ({
  ...jest.requireActual('src/components/JsonModal'),
  JsonModal: () => <div data-test="mock-json-modal" />,
}));

const unexpectedGetCellContent = () => 'none';

test('should render NULL for null cell data', () => {
  const { container } = render(
    <>
      {renderResultCell({
        cellData: null,
        columnKey: 'column1',
        getCellContent: unexpectedGetCellContent,
      })}
    </>,
  );
  expect(container).toHaveTextContent('NULL');
});

test('should render JsonModal for json cell data', () => {
  const { getByTestId } = render(
    <>
      {renderResultCell({
        cellData: '{ "a": 1 }',
        columnKey: 'a',
        getCellContent: unexpectedGetCellContent,
      })}
    </>,
  );
  expect(getByTestId('mock-json-modal')).toBeInTheDocument();
});

test('should render cellData value for default cell data', () => {
  const { container } = render(
    <>
      {renderResultCell({
        cellData: 'regular_text',
        columnKey: 'a',
      })}
    </>,
  );
  expect(container).toHaveTextContent('regular_text');
});

test('should transform cell data by getCellContent for the regular text', () => {
  const { container } = render(
    <>
      {renderResultCell({
        cellData: 'regular_text',
        columnKey: 'a',
        getCellContent: ({ cellData, columnKey }) => `${cellData}:${columnKey}`,
      })}
    </>,
  );
  expect(container).toHaveTextContent('regular_text:a');
});

test('should render angle brackets as plain text when allowHTML is false', () => {
  const { container } = render(
    <>
      {renderResultCell({
        cellData: '<div>test</div>',
        columnKey: 'a',
        allowHTML: false,
      })}
    </>,
  );
  expect(container).toHaveTextContent('<div>test</div>');
});

test('should render custom tags as plain text when allowHTML is false', () => {
  const { container } = render(
    <>
      {renderResultCell({
        cellData: '<custom>value</custom>',
        columnKey: 'a',
        allowHTML: false,
      })}
    </>,
  );
  expect(container).toHaveTextContent('<custom>value</custom>');
});

test('should render empty tags as plain text when allowHTML is false', () => {
  const { container } = render(
    <>
      {renderResultCell({
        cellData: '<test>',
        columnKey: 'a',
        allowHTML: false,
      })}
    </>,
  );
  expect(container).toHaveTextContent('<test>');
});

test('should render comparison operators when allowHTML is false', () => {
  const { container } = render(
    <>
      {renderResultCell({
        cellData: 'Price: 5 < x < 10',
        columnKey: 'a',
        allowHTML: false,
      })}
    </>,
  );
  expect(container).toHaveTextContent('Price: 5 < x < 10');
});

test('should render HTML when allowHTML is explicitly true', () => {
  const { container } = render(
    <>
      {renderResultCell({
        cellData: '<div>test</div>',
        columnKey: 'a',
        allowHTML: true,
      })}
    </>,
  );
  // Should render as HTML, not plain text
  const span = container.querySelector('.safe-html-wrapper');
  expect(span).toBeInTheDocument();
});

test('should default to allowHTML false', () => {
  const { container } = render(
    <>
      {renderResultCell({
        cellData: '<div>test</div>',
        columnKey: 'a',
        // allowHTML not provided - should default to false
      })}
    </>,
  );
  expect(container).toHaveTextContent('<div>test</div>');
});
