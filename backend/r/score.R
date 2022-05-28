library("ltm")
args <- commandArgs()
path <- args[6]
data <- read.csv(path, sep=',')

res_2pl <- ltm(data ~ z1)

pp_eap <- factor.scores(res_2pl, method = "EAP", resp.patterns = data)
EAP <- pp_eap$score.dat$z1
print(EAP[length(EAP)])