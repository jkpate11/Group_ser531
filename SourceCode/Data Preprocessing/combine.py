# combining data from two different sources
import pandas as pd

# Read the Excel data into DataFrames
homice_df = pd.read_excel('Homice.xlsx')
hate_df = pd.read_excel('hate.xlsx')

# keep only first 7 digits of ORI column in hate_df
hate_df['ORI'] = hate_df['ORI'].str[:7]
# keep only V3, V7, V11, V4, V6, V8, V2, V13, V16, V18, V29, V30, V31, V32, v19, v20, v21,v22,v23,v24,v25,v26,v27,v28 in homice_df
homice_df = homice_df[['V3', 'V7', 'V11', 'V4', 'V6', 'V8', 'V2', 'V13', 'V16', 'V18', 'V29', 'V30', 'V31', 'V32', 'V19', 'V20', 'V21','V22','V23','V24','V25','V26','V27','V28']]

# keep only STATNUM, ORI, POPGRP, POP1, COUNTY1, AGNAME, INCIDDTE, TNUMVTMS, TNUMOFF, GOFFRAC, LOCCOD1, BIASMO1,   VTYP_B1, VTYP_F1, VTYP_G1, VTYP_R1, VTYP_S1, VTYP_O1, VTYP_U1 in hate_df
hate_df = hate_df[['STATNUM', 'ORI', 'POPGRP', 'POP1', 'COUNTY1', 'AGNAME', 'INCIDDTE', 'TNUMVTMS', 'TNUMOFF', 'GOFFRAC', 'LOCCOD1', 'BIASMO1', 'VTYP_B1', 'VTYP_F1', 'VTYP_G1', 'VTYP_R1', 'VTYP_S1', 'VTYP_O1', 'VTYP_U1']]
#  split INCIDDTE column in hate_df (number YYYYMMDD) into INCIDMONTH and INCIDYEAR
hate_df['INCIDMONTH'] = hate_df['INCIDDTE'].astype(str).str[4:6]
hate_df['INCIDYEAR'] = hate_df['INCIDDTE'].astype(str).str[:4]
#rename GOFFRAC column in hate_df to O1RACE
hate_df = hate_df.rename(columns={'GOFFRAC': 'O1RACE'})
# rename OFFCOD1 column in hate_df to HOMTYPE
hate_df = hate_df.rename(columns={'OFFCOD1': 'HOMTYPE'})
# rename LOCCOD1 column in hate_df to LOCTYPE
hate_df = hate_df.rename(columns={'LOCCOD1': 'LOCTYPE'})
# rename BIASMO1 column in hate_df to BIASMOTIV
hate_df = hate_df.rename(columns={'BIASMO1': 'BIASMOTIV'})

# combine VTYP_B1, VTYP_F1, VTYP_G1, VTYP_R1, VTYP_S1, VTYP_O1, VTYP_U1 columns in hate_df into VICTTYPE column, if value is 1, then add the column name to the VICTTYPE column
import numpy as np

boolean_columns = ['VTYP_B1', 'VTYP_F1', 'VTYP_G1', 'VTYP_R1', 'VTYP_S1', 'VTYP_O1', 'VTYP_U1']
# List of corresponding letters
letters = ['B', 'F', 'G', 'R', 'S', 'O', 'U']
# Create conditions and corresponding values
conditions = [hate_df[column] == 1 for column in boolean_columns]
values = [letter for letter in letters]
# Use numpy.select to create the new column 'VICTTYPE'
hate_df['VICTTYPE'] = np.select(conditions, values, default='None')
# Optional: If you want to convert the 'VICTTYPE' column to string
hate_df['VICTTYPE'] = hate_df['VICTTYPE'].astype(str)
# remove columns VTYP_B1, VTYP_F1, VTYP_G1, VTYP_R1, VTYP_S1, VTYP_O1, VTYP_U1 in hate_df
hate_df = hate_df.drop(['INCIDDTE','VTYP_B1', 'VTYP_F1', 'VTYP_G1', 'VTYP_R1', 'VTYP_S1', 'VTYP_O1', 'VTYP_U1'], axis=1)
# print(hate_df.shape)
# print(hate_df.head())

# rename V3 column in homice_df to ORI
homice_df = homice_df.rename(columns={'V3': 'ORI'})
# rename V4 column in homice_df to POPGRP
homice_df = homice_df.rename(columns={'V4': 'POPGRP'})
# rename V11 column in homice_df to AGNAME
homice_df = homice_df.rename(columns={'V11': 'AGNAME'})
# rename V7 column in homice_df to POP1
homice_df = homice_df.rename(columns={'V7': 'POP1'})
# rename V6 column in homice_df to INCIDYEAR
homice_df = homice_df.rename(columns={'V6': 'INCIDYEAR'})
# rename V8 column in homice_df to COUNTY1
homice_df = homice_df.rename(columns={'V8': 'COUNTY1'})
# rename V2 column in homice_df to STATNUM
homice_df = homice_df.rename(columns={'V2': 'STATNUM'})
# rename V13 column in homice_df to INCIDMONTH
homice_df = homice_df.rename(columns={'V13': 'INCIDMONTH'})
# rename V16 column in homice_df to OFFCOD1
homice_df = homice_df.rename(columns={'V16': 'HOMTYPE'})
# rename V18 column in homice_df to HOMULT
homice_df = homice_df.rename(columns={'V18': 'HOMULT'})
# rename V29 column in homice_df to CIRCUM
homice_df = homice_df.rename(columns={'V29': 'CIRCUM'})
# rename V30 column in homice_df to SUBCIRC
homice_df = homice_df.rename(columns={'V30': 'SUBCIRC'})
# rename V31 column in homice_df to TNUMVTMS and add 1 to each value
homice_df = homice_df.rename(columns={'V31': 'TNUMVTMS'})
homice_df['TNUMVTMS'] = homice_df['TNUMVTMS'] + 1
# rename V32 column in homice_df to TNUMOFF and add 1 to each value
homice_df = homice_df.rename(columns={'V32': 'TNUMOFF'})
homice_df['TNUMOFF'] = homice_df['TNUMOFF'] + 1
# rename V19 column in homice_df to V1AGE
homice_df = homice_df.rename(columns={'V19': 'V1AGE'})
# rename V20 column in homice_df to V1SEX
homice_df = homice_df.rename(columns={'V20': 'V1SEX'})
# rename V21 column in homice_df to V1RACE
homice_df = homice_df.rename(columns={'V21': 'V1RACE'})
# rename V22 column in homice_df to V1ETH
homice_df = homice_df.rename(columns={'V22': 'V1ETH'})
# rename V23 column in homice_df to O1AGE
homice_df = homice_df.rename(columns={'V23': 'O1AGE'})
# rename V24 column in homice_df to O1SEX
homice_df = homice_df.rename(columns={'V24': 'O1SEX'})
# rename V25 column in homice_df to O1RACE
homice_df = homice_df.rename(columns={'V25': 'O1RACE'})
# rename V26 column in homice_df to O1ETH
homice_df = homice_df.rename(columns={'V26': 'O1ETH'})
# rename V27 column in homice_df to )1WEAP
homice_df = homice_df.rename(columns={'V27': 'O1WEAP'})
# rename V28 column in homice_df to O1REL
homice_df = homice_df.rename(columns={'V28': 'O1REL'})

# homice_df._append(hate_df)
combined_df = pd.concat([homice_df, hate_df], ignore_index=True)
print(homice_df.shape)
print(hate_df.shape)
print(combined_df.shape)
print(combined_df.head())

# export combined_df to xlsx
combined_df.to_excel('combined.xlsx', index=False)