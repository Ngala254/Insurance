#!/usr/bin/env node

/**
 *
 * The output engine prints out to the stdout the quotation generated by the
 * processing engine.
 */

const {
  getCoverType,
  getSection,
  getSectionC,
  singleIndividualCalc,
  multipleIndividualCalc,
} = require('./processing_engine');

let covertype = '';

const coverType = getCoverType().multiple;
const section = getSection(coverType);
const termsInYrs = (section.termsInMonths / 12).toPrecision(3);
const benefit = section.individualRetrenchmentCover ? 'Yes' : 'No';

covertype = coverType === 'single'
  ? 'Single Individual & Sole Proprietorship'
  : 'Multiple Individuals & Partnerships';

let totalPremiumPayable;

if (coverType === 'single') {
  if (benefit === 'Yes') {
    totalPremiumPayable = section.individualRetrenchmentCover
    && singleIndividualCalc().checkerFunc();
  } else {
    totalPremiumPayable = !section.individualRetrenchmentCover
    && singleIndividualCalc().checkerFunc();
  }
} else {
  totalPremiumPayable = multipleIndividualCalc();
}

const NumOfPremiumInstallments = 0.2;
const annualPremiumPayable = totalPremiumPayable / NumOfPremiumInstallments;

const retrenchmentString = `
  -----------------------------------------------------------------------------
  |                              Selected Optional Benefits                   |
  -----------------------------------------------------------------------------
  |Retrenchment Cover/Job Loss    | ${benefit}\t\t                              |
  -----------------------------------------------------------------------------
`;

const outputString = `\n\t\t\tPolicy Quotation\n
  -----------------------------------------------------------------------------
  |                              Policy Details                               |
  -----------------------------------------------------------------------------
  |Type of Cover                  | ${covertype}    
  -----------------------------------------------------------------------------
  |Term in Months                 | ${section.termsInMonths}\t\t\t\t\t      |
  -----------------------------------------------------------------------------
  |Term in Years                  | ${termsInYrs}\t\t                      |
  -----------------------------------------------------------------------------
  |Initial Sum Assured            | ${section.sumAssured}\t\t\t              |
  -----------------------------------------------------------------------------
  |Premium Frequency              | ${getSectionC().premiumFrequency.annual}\t\t\t\t      |
  -----------------------------------------------------------------------------

  ${coverType === 'single' ? retrenchmentString : ''}
  
  -----------------------------------------------------------------------------
  |                              Premium details                              |
  -----------------------------------------------------------------------------
  |Annual Premium Payable         | ${annualPremiumPayable}\t\t\t              |
  -----------------------------------------------------------------------------
  |Number of Premium Installments | ${NumOfPremiumInstallments}\t\t\t\t\t      |
  -----------------------------------------------------------------------------
  |Total Premiums payable         | ${totalPremiumPayable}\t\t\t              |
  -----------------------------------------------------------------------------
  `;

console.log(outputString);
