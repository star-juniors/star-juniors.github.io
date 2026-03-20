---
parent: Publication process
title: HEPdata yaml format
---
*Author: Gabe Dale-Gau* 

# ROOT to Yaml for HEPdata

Often when submitting a paper, you have final histograms stored in root files that are used to plot figures in your paper. When a paper is submitted, the data presented must also be uploaded to the HEPdata website. HEPdata only accepts submissions in YAML format. These two simple macros take a root file containing histograms and convert them to a YAML data file in the format expected by HEPdata. Before official submission, the YAML files will still need to be nested within a submission file following the guidelines laid out here:

<https://hepdata-submission.readthedocs.io/en/latest/submission_yaml.html>

But I have found these two macros useful to avoid manually entering data values as well as to standardize significant figures across multiple histograms:


[rootToText.c](https://github.com/gdgau8/root_to_YAML/blob/main/rootToText.c)

[formatter_TH1V_toHEPData_overlay.C](https://github.com/gdgau8/root_to_YAML/blob/main/formatter_TH1V_toHEPData_overlay.C)



The procedure takes a root file and converts it to a txt file containing the binning, central values, and errors for all histograms. That text file is then taken in by the second macro and converted to a YAML file that can be uploaded directly to HEPdata. The procedure is as follows:

Add your root file to this directory
    Run:
```bash
root

.x rootToText.c("input.root","output.txt")

.L formatter_TH1V_toHEPData_overlay.C

FormatterTH1VtoHEPDataOverlay("output.txt","output.yaml")
```

Test your output by uploading it to the HEPdata sandbox:

<https://www.hepdata.net/record/sandbox>




