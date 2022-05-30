library("ltm")
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

print(EAP[index])
