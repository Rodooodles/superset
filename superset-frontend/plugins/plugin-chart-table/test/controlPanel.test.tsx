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
import { ControlPanelsContainerProps } from '@superset-ui/chart-controls';
import { QueryMode } from '@superset-ui/core';
import controlPanel from '../src/controlPanel';

describe('Table Chart Control Panel - order_desc visibility', () => {
  const findOrderDescControl = () => {
    const controlSetRows = controlPanel.controlPanelSections[0].controlSetRows;
    const orderDescRow = controlSetRows.find(
      row => Array.isArray(row) && row[0]?.name === 'order_desc',
    );
    return orderDescRow?.[0];
  };

  it('should hide order_desc when no sort metric is selected', () => {
    const controls = {
      timeseries_limit_metric: { value: null },
      query_mode: { value: QueryMode.Aggregate },
      all_columns: { value: [] },
    };

    const orderDescControl = findOrderDescControl();
    expect(orderDescControl).toBeDefined();

    const { visibility } = orderDescControl.config;
    expect(typeof visibility).toBe('function');

    const isVisible = visibility?.({
      controls,
    } as unknown as ControlPanelsContainerProps);

    expect(isVisible).toBe(false);
  });

  it('should hide order_desc when sort metric is empty array', () => {
    const controls = {
      timeseries_limit_metric: { value: [] },
      query_mode: { value: QueryMode.Aggregate },
      all_columns: { value: [] },
    };

    const orderDescControl = findOrderDescControl();
    const { visibility } = orderDescControl.config;

    const isVisible = visibility?.({
      controls,
    } as unknown as ControlPanelsContainerProps);

    expect(isVisible).toBe(false);
  });

  it('should show order_desc when sort metric is selected in aggregate mode', () => {
    const controls = {
      timeseries_limit_metric: { value: 'count' },
      query_mode: { value: QueryMode.Aggregate },
      all_columns: { value: [] },
    };

    const orderDescControl = findOrderDescControl();
    const { visibility } = orderDescControl.config;

    const isVisible = visibility?.({
      controls,
    } as unknown as ControlPanelsContainerProps);

    expect(isVisible).toBe(true);
  });

  it('should show order_desc when sort metric array has values in aggregate mode', () => {
    const controls = {
      timeseries_limit_metric: { value: ['count'] },
      query_mode: { value: QueryMode.Aggregate },
      all_columns: { value: [] },
    };

    const orderDescControl = findOrderDescControl();
    const { visibility } = orderDescControl.config;

    const isVisible = visibility?.({
      controls,
    } as unknown as ControlPanelsContainerProps);

    expect(isVisible).toBe(true);
  });

  it('should hide order_desc in raw mode even with metric selected', () => {
    const controls = {
      timeseries_limit_metric: { value: 'count' },
      query_mode: { value: QueryMode.Raw },
      all_columns: { value: ['column1'] },
    };

    const orderDescControl = findOrderDescControl();
    const { visibility } = orderDescControl.config;

    const isVisible = visibility?.({
      controls,
    } as unknown as ControlPanelsContainerProps);

    expect(isVisible).toBe(false);
  });

  it('should have resetOnHide set to false to preserve user preference', () => {
    const orderDescControl = findOrderDescControl();
    expect(orderDescControl.config.resetOnHide).toBe(false);
  });

  it('should be positioned after timeseries_limit_metric in controlSetRows', () => {
    const controlSetRows = controlPanel.controlPanelSections[0].controlSetRows;
    
    // Find indices of the controls
    let timeseriesIndex = -1;
    let orderDescIndex = -1;
    let orderByColsIndex = -1;

    controlSetRows.forEach((row, index) => {
      if (Array.isArray(row)) {
        if (row[0]?.name === 'timeseries_limit_metric') {
          timeseriesIndex = index;
        } else if (row[0]?.name === 'order_desc') {
          orderDescIndex = index;
        } else if (row[0]?.name === 'order_by_cols') {
          orderByColsIndex = index;
        }
      }
    });

    // Verify order_desc comes after timeseries_limit_metric
    expect(timeseriesIndex).toBeGreaterThan(-1);
    expect(orderDescIndex).toBeGreaterThan(-1);
    expect(orderDescIndex).toBeGreaterThan(timeseriesIndex);

    // Verify order_desc comes before order_by_cols
    expect(orderByColsIndex).toBeGreaterThan(-1);
    expect(orderDescIndex).toBeLessThan(orderByColsIndex);
  });

  it('should be in its own row, not sharing with other controls', () => {
    const controlSetRows = controlPanel.controlPanelSections[0].controlSetRows;
    const orderDescRow = controlSetRows.find(
      row => Array.isArray(row) && row[0]?.name === 'order_desc',
    );

    expect(orderDescRow).toBeDefined();
    expect(Array.isArray(orderDescRow)).toBe(true);
    expect(orderDescRow?.length).toBe(1);
  });
});

