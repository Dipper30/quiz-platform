# install packages and defineing their repo sources
# install.packages("ltm", repos = "http://cran.us.r-project.org")
# install.packages("polycor", repos = "http://cran.us.r-project.org")
# install.packages("msm", repos = "http://cran.us.r-project.org")
# install.packages("MASS", repos = "http://cran.us.r-project.org")
library("ltm")
library("polycor")
library("msm")
library("MASS")
args <- commandArgs()
path <- args[6] # csv file name
arg7 <- args[7] # history id
data <- read.csv(path, sep=',')

ID <- data[[1]]
hid <- as.numeric(arg7)
cnt <- 1
index <- cnt
while (cnt <= length(ID)) {
  if (ID[cnt] == hid) {
    index <- cnt
  }
  cnt = cnt + 1
}

dataWithoutID <- data[-1]

res_2pl <- ltm(dataWithoutID ~ z1)
pp_eap <- factor.scores(res_2pl, method = "EAP", resp.patterns = dataWithoutID)
EAP <- pp_eap$score.dat$z1

if (hid == '-1') {
  print(EAP)
} else {
  index <- cnt
  while (cnt <= length(ID)) {
    if (ID[cnt] == hid) {
      index <- cnt
    }
    cnt = cnt + 1
  }
  print(EAP[index])
}
