---
parent: Publication process
title: Preliminary figure guidances
---
# **Preliminary figures guidances**

1. **All the preliminary figures MUST contain a "STAR Preliminary" label.**  
2. On the preliminary figures, x-axis and y-axis titles, labels, and tick markers should be clearly visible.  
3. Information about the dataset used for the preliminary figure, such as year, collision system, collision energy, and centrality (if applicable), needs to be displayed.  
4. Other key information, such as the kinematic cuts, legend, etc., should be added as well.  
5. The legend should not overlap with data points. Keep the legend organized and in one place if possible.  
6. Font size should be reasonably large such that the audience can clearly see them.  
7. Avoid invisible colors like Cyan, Green, and Yellow for markers and uncertainty boxes.

Archive with preliminaries:
[https://drupal.star.bnl.gov/STAR/pwg/common/star-preliminary-results-archive](https://drupal.star.bnl.gov/STAR/pwg/common/star-preliminary-results-archive)


### 📌 **Template**  

- **This template is meant as an example. Please feel free to modify it or use your own style. Please make sure that all the key information is displayed properly on the figure.**  

![alt text](/img/preliminary_format.png)

```cpp
{
   TCanvas *c = new TCanvas("c", "c",429,80,800,602);
   gStyle->SetOptStat(0);
   c->Range(-1.156662,-0.1237805,10.52709,1.103354);
   c->SetFillColor(0);
   c->SetBorderMode(0);
   c->SetBorderSize(2);
   c->SetRightMargin(0.045);
   c->SetTopMargin(0.045);
   c->SetFrameBorderMode(0);
   c->SetFrameBorderMode(0);
   
   TH1F *hplot = new TH1F("hplot","",100,0,10);
   hplot->SetStats(0);

   Int_t ci;      // for color index setting
   TColor *color; // for color definition with alpha
   ci = TColor::GetColor("#000099");
   hplot->SetLineColor(ci);
   hplot->GetXaxis()->SetTitle("x-axis title [unit]");
   hplot->GetXaxis()->SetTitleSize(0.045);
   hplot->GetXaxis()->SetLabelSize(0.04);
   hplot->GetYaxis()->SetTitle("y-axis title [unit]");
   hplot->GetYaxis()->SetTitleSize(0.045);
   hplot->GetYaxis()->SetLabelSize(0.04);
   hplot->GetYaxis()->SetTitleOffset(1);
   hplot->GetZaxis()->SetLabelFont(42);
   hplot->GetZaxis()->SetLabelSize(0.035);
   hplot->GetZaxis()->SetTitleSize(0.035);
   hplot->GetZaxis()->SetTitleFont(42);
   hplot->Draw("");
   
   TPaveText *pt = new TPaveText(0.5,0.82,0.65,0.92,"brNDC");
   pt->SetBorderSize(0);
   pt->SetFillStyle(0);
   pt->SetTextAlign(11);
   pt->SetTextFont(42);
   pt->SetTextSize(0.04);
   pt->AddText("Au+Au #sqrt{s_{NN}} = 200 GeV (year 2011)");
   pt->AddText("Centrality: 0-10%");
   pt->Draw();
   
   pt = new TPaveText(0.15,0.87,0.23,0.92,"brNDC");
   pt->SetBorderSize(0);
   pt->SetFillStyle(0);
   pt->SetTextSize(0.05);
   pt->SetTextFont(62);
   pt->AddText("STAR");
   pt->Draw();
   
   pt = new TPaveText(0.275,0.865,0.375,0.915,"brNDC");
   pt->SetBorderSize(0);
   pt->SetFillStyle(0);
   pt->SetTextFont(52);
   pt->SetTextSize(0.05);
   pt->AddText("Preliminary");
   pt->Draw();
   c->Modified();
   c->cd();
   c->SetSelected(c);

   c->SaveAs("temp.PrelPlot.pdf");
}
```
