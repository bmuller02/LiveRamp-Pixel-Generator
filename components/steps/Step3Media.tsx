"use client";

import React, { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { usePixelStore } from '../../PixelContext';
import { AD_SERVERS, HARD_CODE_PARTNER_KEY, LIVERAMP_AMAZON_PARTNER_KEY } from '../../constants';
import { useHasMounted } from '../../hooks/useHasMounted';

const Step3Media: React.FC = () => {
  const { state, setMediaPartner, setHardcodeRows, acknowledgeMediaAmazonWarning } = usePixelStore();
  const hasMounted = useHasMounted();
  const partners = React.useMemo(() => Object.entries(AD_SERVERS), []);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState('');
  const [uploadedCount, setUploadedCount] = useState(0);
  const showAmazonWarning = state.mediaPartner === LIVERAMP_AMAZON_PARTNER_KEY && !state.mediaAmazonWarningAcknowledged;
  const warningIframeDoc = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      body {
        margin: 0;
        padding: 16px;
        background: #fef2f2;
        color: #7f1d1d;
        font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif;
        font-size: 14px;
        line-height: 1.6;
      }
    </style>
  </head>
  <body>
    You have selected Amazon as the partner for this LiveRamp media pixel. While Amazon does allow advertisers to measure with LiveRamp, they do not allow it via the traditional pixel method and instead require the use of their server-to-server (S2S) "Adapter URL" method, due to environment limitations and privacy standards. Therefore, the script you will see after acknowledging this message will not look like a traditional LiveRamp pixel. To use it, simply send the LiveRamp Adapter URL to Amazon instructing them on which placements to append it.
  </body>
</html>`;

  const isHardcodeSelected = state.mediaPartner === HARD_CODE_PARTNER_KEY;
  const templateHeaders = ['Advertiser ID', 'Campaign ID', 'Site ID', 'Creative ID', 'Placement ID'];

  const handleSelectPartner = (key: string, isSelected: boolean) => {
    const nextPartner = isSelected ? '' : key;
    setMediaPartner(nextPartner);
    if (nextPartner !== HARD_CODE_PARTNER_KEY) {
      setHardcodeRows([]);
      setUploadedCount(0);
      setUploadError('');
    }
  };

  const handleDownloadTemplate = () => {
    const worksheet = XLSX.utils.aoa_to_sheet([templateHeaders]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');
    const arrayBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([arrayBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'LiveRamp_Pixel_Template.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleUploadClick = () => {
    setUploadError('');
    fileInputRef.current?.click();
  };

  const normalizeHeader = (value: string) => value.toLowerCase().replace(/\s+/g, '');

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rawRows = XLSX.utils.sheet_to_json<Record<string, string | number>>(sheet, { defval: '' });

      const headerMap = {
        advertiserid: 'advertiserID',
        campaignid: 'campaignID',
        siteid: 'siteID',
        creativeid: 'creativeID',
        placementid: 'placementID',
      } as const;

      const rows = rawRows
        .map((row) => {
          const normalized: Record<string, string> = {};
          Object.keys(row).forEach((key) => {
            const normalizedKey = normalizeHeader(key);
            const mappedKey = headerMap[normalizedKey as keyof typeof headerMap];
            if (mappedKey) {
              normalized[mappedKey] = String(row[key]).trim();
            }
          });

          return {
            advertiserID: normalized.advertiserID || '',
            campaignID: normalized.campaignID || '',
            siteID: normalized.siteID || '',
            creativeID: normalized.creativeID || '',
            placementID: normalized.placementID || '',
          };
        })
        .filter((row) => Object.values(row).some((value) => value !== ''))
        .filter((row) => {
          const isNumeric = (value: string) => /^\d+$/.test(value);
          return (
            isNumeric(row.advertiserID) &&
            isNumeric(row.campaignID) &&
            isNumeric(row.siteID) &&
            isNumeric(row.creativeID) &&
            isNumeric(row.placementID)
          );
        });

      if (rows.length === 0) {
        setUploadError('No valid rows found. Ensure all five columns are present and numeric.');
        setHardcodeRows([]);
        setUploadedCount(0);
      } else {
        setHardcodeRows(rows);
        setUploadedCount(rows.length);
        setUploadError('');
      }
    } catch (error) {
      console.error('Failed to parse template:', error);
      setUploadError('Unable to read file. Please upload a valid .xlsx template.');
      setHardcodeRows([]);
      setUploadedCount(0);
    }
  };

  if (!hasMounted) return null;

  return (
    <>
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">Specify Ad Server / Partner</h3>
        <p className="text-sm text-zinc-500">
          Select the Ad Server or Partner where this pixel will be hosted.
        </p>
      </div>
      <div className="p-6 pt-0">
        <div className="max-w-2xl">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-3 block">
            Ad Server / Partner Name
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {partners.map(([key, def]) => {
              const isSelected = state.mediaPartner === key;
              const isDimmed = state.mediaPartner !== '' && !isSelected;

              return (
                <label
                  key={key}
                  className={`flex items-center gap-3 rounded-md border px-3 py-2 text-sm transition-colors cursor-pointer
                    ${isSelected ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-zinc-200 bg-white text-zinc-900'}
                    ${isDimmed ? 'opacity-50' : 'hover:border-zinc-300'}`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleSelectPartner(key, isSelected)}
                    className="h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-600"
                  />
                  <span className="select-none">{def.name}</span>
                </label>
              );
            })}
          </div>

          {isHardcodeSelected && (
            <div className="mt-4 space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-white text-zinc-900 border border-zinc-200 hover:bg-zinc-100 h-10 px-4 py-2"
                >
                  Download Template
                </button>
                <button
                  type="button"
                  onClick={handleUploadClick}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-emerald-600 text-white hover:bg-emerald-700 h-10 px-4 py-2"
                >
                  Upload Template
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              {uploadedCount > 0 && !uploadError && (
                <p className="text-sm text-emerald-600 font-medium">
                  Uploaded {uploadedCount} row{uploadedCount === 1 ? '' : 's'} successfully.
                </p>
              )}

              {uploadError && (
                <p className="text-sm text-red-600 font-medium">
                  {uploadError}
                </p>
              )}
            </div>
          )}

          {state.mediaPartner && (
            <div className="mt-3 text-[0.8rem] text-emerald-600 font-medium flex items-center gap-1.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Selected: {AD_SERVERS[state.mediaPartner]?.name}
            </div>
          )}
        </div>
      </div>

      {showAmazonWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/50 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="liveramp-amazon-warning-title"
            className="w-full max-w-2xl rounded-xl border border-red-200 bg-red-50 p-6 shadow-xl"
          >
            <h4 id="liveramp-amazon-warning-title" className="text-lg font-semibold text-red-900">
              FYI
            </h4>
            <iframe
              title="LiveRamp Amazon warning"
              srcDoc={warningIframeDoc}
              className="mt-3 h-52 w-full rounded-md border border-red-200 bg-red-50"
            />
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={acknowledgeMediaAmazonWarning}
                className="inline-flex items-center justify-center rounded-md bg-red-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700 focus-visible:ring-offset-2"
              >
                Acknowledged
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Step3Media;