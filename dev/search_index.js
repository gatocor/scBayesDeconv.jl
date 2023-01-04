var documenterSearchIndex = {"docs":
[{"location":"examples/Artificial Convolutions.html#Artificial-convolutions","page":"Artificial convolutions","title":"Artificial convolutions","text":"","category":"section"},{"location":"examples/Artificial Convolutions.html","page":"Artificial convolutions","title":"Artificial convolutions","text":"In this example we are going to show results from artificial convolutions in which the target ground truth exists and to see the effect of the deconvolution.","category":"page"},{"location":"examples/Artificial Convolutions.html","page":"Artificial convolutions","title":"Artificial convolutions","text":"The first thing will be to load the necessry packages to make the distributions and plots.","category":"page"},{"location":"examples/Artificial Convolutions.html","page":"Artificial convolutions","title":"Artificial convolutions","text":"using Distributions\nusing Random\nusing Plots","category":"page"},{"location":"examples/Artificial Convolutions.html","page":"Artificial convolutions","title":"Artificial convolutions","text":"Then, we load the scBayesdeconv distribution package.","category":"page"},{"location":"examples/Artificial Convolutions.html","page":"Artificial convolutions","title":"Artificial convolutions","text":"using scBayesDeconv","category":"page"},{"location":"examples/Artificial Convolutions.html#Distribution-where-the-noise-produces-an-artifact-and-a-shift","page":"Artificial convolutions","title":"Distribution where the noise produces an artifact and a shift","text":"","category":"section"},{"location":"examples/Artificial Convolutions.html","page":"Artificial convolutions","title":"Artificial convolutions","text":"In this example we produce a noise that is clearly bimodal and some non-zero displacement. This noise, when convolved to any distribution will produce additional peacks and a shift in the original distribution.","category":"page"},{"location":"examples/Artificial Convolutions.html","page":"Artificial convolutions","title":"Artificial convolutions","text":"First, we create the artificial distributions of the noise and the target using the package Distributions.jl.","category":"page"},{"location":"examples/Artificial Convolutions.html","page":"Artificial convolutions","title":"Artificial convolutions","text":"# target distribution\nndist = MixtureModel(\n    MultivariateNormal[\n        MultivariateNormal([10],ones(1,1)),\n        MultivariateNormal([50],ones(1,1))\n    ],\n    [.5,.5]\n    )\n\n# noise distribution\ntdist = MixtureModel(\n    MultivariateNormal[\n        MultivariateNormal([0],ones(1,1))\n    ],\n    [1.]\n    );","category":"page"},{"location":"examples/Artificial Convolutions.html","page":"Artificial convolutions","title":"Artificial convolutions","text":"Then, we create random samples to generate the dataset.","category":"page"},{"location":"examples/Artificial Convolutions.html","page":"Artificial convolutions","title":"Artificial convolutions","text":"N = 1000\n\nt = Matrix(transpose(rand(tdist,N)));\nn = Matrix(transpose(rand(ndist,N)));\nc = Matrix(transpose(rand(ndist,N)))+Matrix(transpose(rand(tdist,N)));\nc = sort(c,dims=1);","category":"page"},{"location":"examples/Artificial Convolutions.html","page":"Artificial convolutions","title":"Artificial convolutions","text":"Finally, we visualize the distributions. ","category":"page"},{"location":"examples/Artificial Convolutions.html","page":"Artificial convolutions","title":"Artificial convolutions","text":"Notice that, in a real case, we will have only samples from the noise and the convolution.","category":"page"},{"location":"examples/Artificial Convolutions.html","page":"Artificial convolutions","title":"Artificial convolutions","text":"bins = range(-10,60,step=.5)\n\nl1 = histogram(vec(n),normalize=true,bins=bins,label=\"noise\",color=\"magenta\")\n\nl2 = histogram(vec(t),normalize=true,bins=bins,label=\"target\",color=\"lightblue\")\n\nl3 = histogram(vec(c),normalize=true,bins=bins,label=\"convolution\",color=\"green\")\n\nplot(l1,l2,l3,layout=(3,1))","category":"page"},{"location":"examples/Artificial Convolutions.html","page":"Artificial convolutions","title":"Artificial convolutions","text":"(Image: svg)","category":"page"},{"location":"examples/Artificial Convolutions.html#Fitting-the-data","page":"Artificial convolutions","title":"Fitting the data","text":"","category":"section"},{"location":"examples/Artificial Convolutions.html","page":"Artificial convolutions","title":"Artificial convolutions","text":"For deconvolving the ditribution we proceed in two steps. The first step is to fit the noise to a Gaussian Mixture Model to have a model of the noise distribution.","category":"page"},{"location":"examples/Artificial Convolutions.html","page":"Artificial convolutions","title":"Artificial convolutions","text":"For that we will use a infinite mixture and allow it to detect by itself the number of components needed to describe the data.","category":"page"},{"location":"examples/Artificial Convolutions.html","page":"Artificial convolutions","title":"Artificial convolutions","text":"dn = infiniteGaussianMixture(n,k=2,Σ0 = ones(1,1),κ0=0.01);","category":"page"},{"location":"examples/Artificial Convolutions.html","page":"Artificial convolutions","title":"Artificial convolutions","text":"Then, we will fit a infinite gaussian deconvolution model to the other data.","category":"page"},{"location":"examples/Artificial Convolutions.html","page":"Artificial convolutions","title":"Artificial convolutions","text":"dt = infiniteGaussianMixtureDeconvolution(c,dn,k=1,Σ0=ones(1,1),κ0=0.01,ν0=0.01,α=1);","category":"page"},{"location":"examples/Artificial Convolutions.html","page":"Artificial convolutions","title":"Artificial convolutions","text":"Finally, we can check the distribution results over the dataset.","category":"page"},{"location":"examples/Artificial Convolutions.html","page":"Artificial convolutions","title":"Artificial convolutions","text":"The fitted models of scBayesDeconvolution are Bayesian model whose samples are in terms of `Distributions.jl distributions, so we can easily compute all the statistics that this package provides for distributions.","category":"page"},{"location":"examples/Artificial Convolutions.html","page":"Artificial convolutions","title":"Artificial convolutions","text":"x = -10:60\nbins = range(-10,60,step=.5)\n\n#Ploting the noise distribution and the samples\nl1 = histogram(vec(n),normalize=true,bins=bins,label=\"noise\",color=\"magenta\")\nfor i in 1:10:100\n    plot!(l1,x,pdf(scBayesDeconv.sample(dn),reshape(x,1,length(x)))[:,1],color=\"red\",label=\"\",alpha=0.1)\nend\n\n#Ploting the noise distribution and the samples\nl2 = histogram(vec(c),normalize=true,bins=bins,label=\"convolution\",color=\"green\")\nfor i in 2:10:100\n    plot!(l2,x,pdf(scBayesDeconv.sample(dt,distribution=:Convolution),reshape(x,1,length(x)))[:,1],color=\"red\",label=\"\",alpha=0.1)\nend\n\n#Ploting the noise distribution and the samples\nl3 = histogram(vec(t),normalize=true,bins=bins,label=\"target\",color=\"lightblue\")\nfor i in 2:10:100\n    plot!(l3,x,pdf(scBayesDeconv.sample(dt),reshape(x,1,length(x)))[:,1],color=\"red\",label=\"\",alpha=0.1)\nend\n\nplot(l1,l2,l3,layout=(3,1))","category":"page"},{"location":"examples/Artificial Convolutions.html","page":"Artificial convolutions","title":"Artificial convolutions","text":"(Image: svg)","category":"page"},{"location":"examples/Artificial Convolutions.html#Distribution-where-the-noise-covers-a-bimodality","page":"Artificial convolutions","title":"Distribution where the noise covers a bimodality","text":"","category":"section"},{"location":"examples/Artificial Convolutions.html","page":"Artificial convolutions","title":"Artificial convolutions","text":"In here we show an example in which the noise covers the bimodal distribution.","category":"page"},{"location":"examples/Artificial Convolutions.html","page":"Artificial convolutions","title":"Artificial convolutions","text":"The procedure is the same as in the other example but focusing in a different problem.","category":"page"},{"location":"examples/Artificial Convolutions.html","page":"Artificial convolutions","title":"Artificial convolutions","text":"tdist = MixtureModel(\n    MultivariateNormal[\n        MultivariateNormal([0],ones(1,1)),\n        MultivariateNormal([3],ones(1,1))\n    ],\n    [.5,.5]\n    )\n\nndist = MixtureModel(\n    MultivariateNormal[\n        MultivariateNormal([0],ones(1,1))\n    ],\n    [1.]\n    )\n\nN = 10000\n\nt = Matrix(transpose(rand(tdist,N)));\nn = Matrix(transpose(rand(ndist,N)));\nc = Matrix(transpose(rand(ndist,N)))+Matrix(transpose(rand(tdist,N)));\nc = sort(c,dims=1);","category":"page"},{"location":"examples/Artificial Convolutions.html","page":"Artificial convolutions","title":"Artificial convolutions","text":"bins = range(-6,10,step=.2)\n\nl1 = histogram(vec(n),normalize=true,bins=bins,label=\"noise\",color=\"magenta\")\n\nl2 = histogram(vec(t),normalize=true,bins=bins,label=\"target\",color=\"lightblue\")\n\nl3 = histogram(vec(c),normalize=true,bins=bins,label=\"convolution\",color=\"green\")\n\nplot(l1,l2,l3,layout=(3,1))","category":"page"},{"location":"examples/Artificial Convolutions.html","page":"Artificial convolutions","title":"Artificial convolutions","text":"(Image: svg)","category":"page"},{"location":"examples/Artificial Convolutions.html","page":"Artificial convolutions","title":"Artificial convolutions","text":"dn = infiniteGaussianMixture(n);","category":"page"},{"location":"examples/Artificial Convolutions.html","page":"Artificial convolutions","title":"Artificial convolutions","text":"dt = infiniteGaussianMixtureDeconvolution(c,dn);","category":"page"},{"location":"examples/Artificial Convolutions.html","page":"Artificial convolutions","title":"Artificial convolutions","text":"x = -6:.1:10\nbins = range(-6,10,step=.2)\n\n#Ploting the noise distribution and the samples\nl1 = histogram(vec(n),normalize=true,bins=bins,label=\"noise\",color=\"magenta\")\nfor i in 1:10:100\n    plot!(l1,x,pdf(scBayesDeconv.sample(dn),reshape(x,1,length(x)))[:,1],color=\"red\",label=\"\",alpha=0.1)\nend\n\n#Ploting the noise distribution and the samples\nl2 = histogram(vec(c),normalize=true,bins=bins,label=\"convolution\",color=\"green\")\nfor i in 2:1:100\n    plot!(l2,x,pdf(scBayesDeconv.sample(dt,distribution=:Convolution),reshape(x,1,length(x)))[:,1],color=\"red\",label=\"\",alpha=0.1)\nend\n\n#Ploting the noise distribution and the samples\nl3 = histogram(vec(t),normalize=true,bins=bins,label=\"target\",color=\"lightblue\")\nfor i in 2:1:100\n    plot!(l3,x,pdf(scBayesDeconv.sample(dt),reshape(x,1,length(x)))[:,1],color=\"red\",label=\"\",alpha=0.1)\nend\nylims!(0,.25)\n\nplot(l1,l2,l3,layout=(3,1))","category":"page"},{"location":"examples/Artificial Convolutions.html","page":"Artificial convolutions","title":"Artificial convolutions","text":"(Image: svg)","category":"page"},{"location":"examples/Artificial Convolutions.html#Distribution-in-several-dimensions","page":"Artificial convolutions","title":"Distribution in several dimensions","text":"","category":"section"},{"location":"examples/Artificial Convolutions.html","page":"Artificial convolutions","title":"Artificial convolutions","text":"The method can be applied to systems with any dimension.","category":"page"},{"location":"examples/Artificial Convolutions.html","page":"Artificial convolutions","title":"Artificial convolutions","text":"tdist = MixtureModel([\n    product_distribution([Gamma(3,2),Gamma(2,3)]),\n    product_distribution([Gamma(5,1),Gamma(7,7)]),\n    product_distribution([Gamma(10,1.5),Gamma(10,7)]),\n]\n)\n\nndist = MixtureModel(\n    [\n        product_distribution([Gamma(3,2),Gamma(2,3)])\n    ],\n    [1.]\n    )\n\nN = 10000\nt = Matrix(transpose(rand(tdist,N)));\nn = Matrix(transpose(rand(ndist,N)));\nc = Matrix(transpose(rand(ndist,N))).+Matrix(transpose(rand(tdist,N)));","category":"page"},{"location":"examples/Artificial Convolutions.html","page":"Artificial convolutions","title":"Artificial convolutions","text":"nShow=2000\n\nl1 = histogram2d(n[:,1],n[:,2],bins=50,markersize=2,label=\"noise\")\n# scatter!(l1,n[1:nShow,1],n[1:nShow,2],markersize=1,markerstrokewidth=0,label=\"noise\",color=\"lightblue\")\nxlims!(0,40)\nylims!(0,180)\n\nl2 = histogram2d(t[:,1],t[:,2],bins=50,markersize=2,label=\"target\")\n# scatter!(l2,t[1:nShow,1],t[1:nShow,2],markersize=1,markerstrokewidth=0,label=\"noise\",color=\"lightblue\")\nxlims!(0,40)\nylims!(0,180)\n\nl3 = histogram2d(c[:,1],c[:,2],bins=50,markersize=2,label=\"convolution\")\n# scatter!(l3,c[1:nShow,1],c[1:nShow,2],markersize=1,markerstrokewidth=0,label=\"noise\",color=\"lightblue\")\nxlims!(0,40)\nylims!(0,180)\n\nplot(l1,l2,l3,layout=(1,3),size=[1900,500])","category":"page"},{"location":"examples/Artificial Convolutions.html","page":"Artificial convolutions","title":"Artificial convolutions","text":"(Image: svg)","category":"page"},{"location":"examples/Artificial Convolutions.html","page":"Artificial convolutions","title":"Artificial convolutions","text":"dn = infiniteGaussianMixture(n);","category":"page"},{"location":"examples/Artificial Convolutions.html","page":"Artificial convolutions","title":"Artificial convolutions","text":"dt = infiniteGaussianMixtureDeconvolution(c,dn);","category":"page"},{"location":"examples/Artificial Convolutions.html","page":"Artificial convolutions","title":"Artificial convolutions","text":"WARNING: Sampling has failed for this covariance matrix. In general this will not be a problem if only happens in rare ocassions.","category":"page"},{"location":"examples/Artificial Convolutions.html","page":"Artificial convolutions","title":"Artificial convolutions","text":"nShow = 1000\n\nl1 = histogram2d(n[:,1],n[:,2],bins=50,markersize=2,label=\"noise\")\n# scatter!(l1,n[1:nShow,1],n[1:nShow,2],markersize=1,markerstrokewidth=0,label=\"noise\",color=\"lightblue\",title=\"Noise\")\nxlims!(0,40)\nylims!(0,180)\n\nl2 = histogram2d(t[:,1],t[:,2],bins=50,markersize=2,label=\"target\")\n# scatter!(l2,t[1:nShow,1],t[1:nShow,2],markersize=1,markerstrokewidth=0,label=\"noise\",color=\"lightblue\",title=\"Target\")\nxlims!(0,40)\nylims!(0,180)\n\nl3 = histogram2d(c[:,1],c[:,2],bins=50,markersize=2,label=\"convolution\")\n# scatter!(l3,c[1:nShow,1],c[1:nShow,2],markersize=1,markerstrokewidth=0,label=\"noise\",color=\"lightblue\",title=\"Convolution\")\nxlims!(0,40)\nylims!(0,180)\n\nd = zeros(10000,2)\nfor i in 1:100\n    aux = rand(dt.samples[i],100)\n    d[(i-1)*100+1:i*100, 1] .= aux[1,:]\n    d[(i-1)*100+1:i*100, 2] .= aux[2,:]\nend\nl4 = histogram2d(d[:,1],d[:,2],bins=100,markersize=2,label=\"convolution\")\n# scatter!(l4,d[1:10:10000,1],d[1:10:10000,2],markersize=1,markerstrokewidth=0,label=\"noise\",color=\"lightblue\",title=\"Deconvolution\")\nxlims!(0,40)\nylims!(0,180)\n\nplot(l1,l2,l3,l4,layout=(2,2),size=[900,600])","category":"page"},{"location":"examples/Artificial Convolutions.html","page":"Artificial convolutions","title":"Artificial convolutions","text":"(Image: svg)","category":"page"},{"location":"examples/Artificial Convolutions.html","page":"Artificial convolutions","title":"Artificial convolutions","text":"","category":"page"},{"location":"examples/Comparison with FFT deconvolution.html#Comparison-with-FFT-deconvolution-methods","page":"Comparison with FFT deconvolution methods","title":"Comparison with FFT deconvolution methods","text":"","category":"section"},{"location":"examples/Comparison with FFT deconvolution.html","page":"Comparison with FFT deconvolution methods","title":"Comparison with FFT deconvolution methods","text":"In this scrip we compare our method with the proposed method of Neumann Neumann & Hössjer for the deconvolution of distributions.","category":"page"},{"location":"examples/Comparison with FFT deconvolution.html","page":"Comparison with FFT deconvolution methods","title":"Comparison with FFT deconvolution methods","text":"This method, as proposed is one dimensional altough it could be in general extended to many dimensions. In the following we will see the artifacts that this method generates.","category":"page"},{"location":"examples/Comparison with FFT deconvolution.html","page":"Comparison with FFT deconvolution methods","title":"Comparison with FFT deconvolution methods","text":"using Distributions\nusing Random\nusing Plots\nusing scBayesDeconv","category":"page"},{"location":"examples/Comparison with FFT deconvolution.html","page":"Comparison with FFT deconvolution methods","title":"Comparison with FFT deconvolution methods","text":"┌ Info: Precompiling scBayesDeconv [ba4b0364-d62a-4552-92b1-eb0a52360a94]\n└ @ Base loading.jl:1342","category":"page"},{"location":"examples/Comparison with FFT deconvolution.html#Create-distributions-and-samples","page":"Comparison with FFT deconvolution methods","title":"Create distributions and samples","text":"","category":"section"},{"location":"examples/Comparison with FFT deconvolution.html","page":"Comparison with FFT deconvolution methods","title":"Comparison with FFT deconvolution methods","text":"N = 5000\nsnr = 2\ndn = Normal(0,1)\ndt = MixtureModel([\n    Normal(-.43,0.6),\n    Normal(1.67,0.6),\n    ],[.8,.2])\n\nnoise = rand(dn,N)/snr\ntarget = rand(dt,N)\nconvolution = rand(dn,N)/snr+rand(dt,N);\n\n# reshape data so it has the required shape of (samples,dimensions)\nn = reshape(noise,N,1)\nt = reshape(target,N,1)\nc = reshape(convolution,N,1);","category":"page"},{"location":"examples/Comparison with FFT deconvolution.html#Fit-deconvolutions","page":"Comparison with FFT deconvolution methods","title":"Fit deconvolutions","text":"","category":"section"},{"location":"examples/Comparison with FFT deconvolution.html","page":"Comparison with FFT deconvolution methods","title":"Comparison with FFT deconvolution methods","text":"We first deconvolve using the Neumann FFT method.","category":"page"},{"location":"examples/Comparison with FFT deconvolution.html","page":"Comparison with FFT deconvolution methods","title":"Comparison with FFT deconvolution methods","text":"tNeumann = neumannDeconvolution(n,c);","category":"page"},{"location":"examples/Comparison with FFT deconvolution.html","page":"Comparison with FFT deconvolution methods","title":"Comparison with FFT deconvolution methods","text":"And then the Bayesian method.","category":"page"},{"location":"examples/Comparison with FFT deconvolution.html","page":"Comparison with FFT deconvolution methods","title":"Comparison with FFT deconvolution methods","text":"dnfitted = infiniteGaussianMixture(n)\ndtfitted = infiniteGaussianMixtureDeconvolution(c,dnfitted);","category":"page"},{"location":"examples/Comparison with FFT deconvolution.html#Plot-results","page":"Comparison with FFT deconvolution methods","title":"Plot results","text":"","category":"section"},{"location":"examples/Comparison with FFT deconvolution.html","page":"Comparison with FFT deconvolution methods","title":"Comparison with FFT deconvolution methods","text":"As we can see the FFT method give results that have some problems as:","category":"page"},{"location":"examples/Comparison with FFT deconvolution.html","page":"Comparison with FFT deconvolution methods","title":"Comparison with FFT deconvolution methods","text":"It allows the deconvolved distribution to have negative values\nThe results are somehow wavy due to the fourier basis employed.","category":"page"},{"location":"examples/Comparison with FFT deconvolution.html","page":"Comparison with FFT deconvolution methods","title":"Comparison with FFT deconvolution methods","text":"x = -4:.01:4.5\nxx = reshape(x,1,length(x))\n\np1 = histogram(convolution,bins=-4:.1:5,title=\"Convolution\",label=\"\",normalize=true,color=\"green\",ylabel=\"p(x)\",xlabel=\"x\")\nhistogram!(noise,bins=-2:0.1:2,inset=(1,bbox(.7,.15,.25,.4)),subplot=2,bg_inside=nothing,label=\"\",normalize=true,title=\"Autofluorescence\",titlefontsize=8,color=\"magenta\",ylabel=\"p(x)\",xlabel=\"x\")\n\np2 = histogram(target,bins=-4:.1:4,title=\"Bayesian deconvolution\",normalize=true,color=\"lightblue\",ylabel=\"p(x)\",xlabel=\"x\",label=\"Deconv. sample\")\ny = zeros(100,length(x))\nplot!(p2,x,pdf(dtfitted.samples[2],xx),color=\"red\",alpha=0.2,label=\"BD samples\")\nfor i in 2:100\n    plot!(p2,x,pdf(sample(dtfitted),xx),label=\"\",color=\"red\",alpha=0.1)\n    y[i,:] = pdf(sample(dtfitted),xx)[:,1]\nend\nplot!(p2,x,mean(y,dims=1)[1,:],label=\"Bayesian deconv.\",color=\"black\",legendfontsize=8)\nxlims!(-4,4)\nylims!(0,.75)\n\np3 = histogram(target,bins=-4:.1:4,title=\"FFT deconvolution\",normalize=true,color=\"lightblue\",ylabel=\"p(x)\",xlabel=\"x\",label=\"Deconv. sample\")\nplot!(p3,x,tNeumann(Vector(x)),linewidth=2,label=\"FFT decon.\")\nxlims!(-4,4)\nylims!(0,.75)\n\nplot(p1,p2,p3,layout=(1,3),size=[1100,220])","category":"page"},{"location":"examples/Comparison with FFT deconvolution.html","page":"Comparison with FFT deconvolution methods","title":"Comparison with FFT deconvolution methods","text":"(Image: svg)","category":"page"},{"location":"examples/Comparison with FFT deconvolution.html#Evaluate-metrics","page":"Comparison with FFT deconvolution methods","title":"Evaluate metrics","text":"","category":"section"},{"location":"examples/Comparison with FFT deconvolution.html","page":"Comparison with FFT deconvolution methods","title":"Comparison with FFT deconvolution methods","text":"To make a more rigourous comparison, we can compare the target data distribution to the deconvolution results using evaluation metrics already implemented in scBayesPackage.","category":"page"},{"location":"examples/Comparison with FFT deconvolution.html","page":"Comparison with FFT deconvolution methods","title":"Comparison with FFT deconvolution methods","text":"f(x) = pdf(dt,x[1])\nmios = scBayesDeconv.metrics.mio(dtfitted,f)\nmioNeumann = scBayesDeconv.metrics.mio(tNeumann,f)\n\nprintln(\"Bayesian MIO: \",round(mean(mios),digits=2),\"±\",round(std(mios),digits=2))\n\nprintln(\"FFT MIO: \",round(mioNeumann,digits=2))","category":"page"},{"location":"examples/Comparison with FFT deconvolution.html","page":"Comparison with FFT deconvolution methods","title":"Comparison with FFT deconvolution methods","text":"Bayesian MIO: 0.97±0.02\nFFT MIO: 0.83","category":"page"},{"location":"index.html#scBayesDeconv.jl","page":"Home","title":"scBayesDeconv.jl","text":"","category":"section"},{"location":"index.html","page":"Home","title":"Home","text":"This is a package that implements the bayesian deconvolution methods for solving the following problem:","category":"page"},{"location":"index.html","page":"Home","title":"Home","text":"C = T + xi","category":"page"},{"location":"index.html","page":"Home","title":"Home","text":"where C, T and xi are random variables and we have sample sets from C and xi; and we would like to know the distribution of the random variable T.","category":"page"},{"location":"index.html#What-is-implemented-in-the-package?","page":"Home","title":"What is implemented in the package?","text":"","category":"section"},{"location":"index.html","page":"Home","title":"Home","text":"Bayesian Gaussian Mixture Models:","category":"page"},{"location":"index.html","page":"Home","title":"Home","text":"Finite Gaussian Mixture Models\nInfinite Gaussian Mixture Models (Dirichlet Processes)","category":"page"},{"location":"index.html","page":"Home","title":"Home","text":"Deconvolution Bayesian Gaussian Mixture Models:","category":"page"},{"location":"index.html","page":"Home","title":"Home","text":"Finite Deconvolution Gaussian Mixture Models\nInfinite Deconvolution Gaussian Mixture Models (Dirichlet Processes)","category":"page"},{"location":"index.html#Installation","page":"Home","title":"Installation","text":"","category":"section"},{"location":"index.html","page":"Home","title":"Home","text":"The package can be installed ass","category":"page"},{"location":"index.html","page":"Home","title":"Home","text":"pkg> add https://github.com/gatocor/scBayesDeconv.jl#VERSION","category":"page"},{"location":"index.html","page":"Home","title":"Home","text":"or ","category":"page"},{"location":"index.html","page":"Home","title":"Home","text":"using Pkg\nPkg.add(\"https://github.com/gatocor/scBayesDeconv.jl#VERSION\")","category":"page"},{"location":"index.html","page":"Home","title":"Home","text":"for the version that you want to install.","category":"page"},{"location":"index.html#Getting-started","page":"Home","title":"Getting started","text":"","category":"section"},{"location":"index.html","page":"Home","title":"Home","text":"To understand the basic usage of these models, it is advised to see the example Artificial convolutions.","category":"page"},{"location":"API.html#API","page":"API","title":"API","text":"","category":"section"},{"location":"API.html#Bayesian-models","page":"API","title":"Bayesian models","text":"","category":"section"},{"location":"API.html","page":"API","title":"API","text":"finiteGaussianMixture\ninfiniteGaussianMixture","category":"page"},{"location":"API.html#scBayesDeconv.finiteGaussianMixture","page":"API","title":"scBayesDeconv.finiteGaussianMixture","text":"finiteGaussianMixture(X::Matrix;\n    k::Int,\n    initialization::Union{String,Matrix} = \"kmeans\",\n    α = 1,\n    ν0 = 1,\n    κ0 = 0.001,\n    μ0 = nothing,\n    Σ0 = nothing,\n    ignoreSteps::Int = 1000, \n    saveSteps::Int = 1000,\n    saveEach::Int = 10,\n    verbose = false\n    )\n\nFunction to fit a finite mixture model to data.\n\nArguments:\n\nX::Matrix: Matrix with data to be fitted as (realizations, dimensions).\n\nKeyword Arguments:\n\nk::Int: Number of components of the mixture.\ninitialization::Union{String,Matrix} = \"kmeans\": Method to initializate the mixture parameters. \nα = 1: Hyperparameter of the Dirichlet distribution. The higher, the more probable that a cell will be assigned to another distribution.\nν0 = 1: Hyperparameter of the InverseWishart distribution. The highler, the more wight has the pior InverseWishart.\nκ0 = 0.001: Hyperparameter of the Normal prior distribution. The higher, the more focussed will be the prior Normal around the mean.\nμ0 = nothing: Hyperparameter of indicating the mean of the Normal. If nothing it will be estimated.\nΣ0 = nothing: Hyperparameter indicating the prior Covariance distribution of the model. If nothing it will be estimated.\nignoreSteps::Int = 1000: Number of steps to perform before saving realizations.\nsaveSteps::Int = 1000: Number of steps to perform from which we will save samples.\nsaveEach::Int = 10: Number of steps to take before saving a sample. \nverbose = false: Is to show progress of the fitting.\nseed = 0: Seed of the random generator.\n\nReturn \n\nA GaussianFiniteMixtureModel with the sampling of the bayesian model.\n\n\n\n\n\n","category":"function"},{"location":"API.html#scBayesDeconv.infiniteGaussianMixture","page":"API","title":"scBayesDeconv.infiniteGaussianMixture","text":"infiniteGaussianMixture(X::Matrix;\n    k::Int,\n    initialization::Union{String,Matrix} = \"kmeans\",\n    α = 1,\n    ν0 = 1,\n    κ0 = 0.001,\n    μ0 = nothing,\n    Σ0 = nothing,\n    ignoreSteps::Int = 1000, \n    saveSteps::Int = 1000,\n    saveEach::Int = 10,\n    verbose = false,\n    seed = 0\n    )\n\nFunction to fit a infinite mixture model to data.\n\nArguments:\n\nX::Matrix: Matrix with data to be fitted as (realizations, dimensions).\n\nKeyword Arguments:\n\nk::Int: Number of components of the mixture to start with.\ninitialization::Union{String,Matrix} = \"kmeans\": Method to initializate the mixture parameters. \nα = 1: Hyperparameter of the Dirichlet distribution. The higher, the more probable that a cell will be assigned to another distribution.\nν0 = 1: Hyperparameter of the InverseWishart distribution. The highler, the more wight has the pior InverseWishart.\nκ0 = 0.001: Hyperparameter of the Normal prior distribution. The higher, the more focussed will be the prior Normal around the mean.\nμ0 = nothing: Hyperparameter of indicating the mean of the Normal. If nothing it will be estimated.\nΣ0 = nothing: Hyperparameter indicating the prior Covariance distribution of the model. If nothing it will be estimated.\nignoreSteps::Int = 1000: Number of steps to perform before saving realizations.\nsaveSteps::Int = 1000: Number of steps to perform from which we will save samples.\nsaveEach::Int = 10: Number of steps to take before saving a sample. \nverbose = false: Is to show progress of the fitting.\nseed = 0: Seed of the random generator.\n\nReturn \n\nA GaussianInfiniteMixtureModel with the sampling of the bayesian model.\n\n\n\n\n\n","category":"function"},{"location":"API.html","page":"API","title":"API","text":"finiteGaussianMixtureDeconvolution\ninfiniteGaussianMixtureDeconvolution","category":"page"},{"location":"API.html#scBayesDeconv.finiteGaussianMixtureDeconvolution","page":"API","title":"scBayesDeconv.finiteGaussianMixtureDeconvolution","text":"finiteGaussianMixtureDeconvolution(X::Matrix, Y::GaussianFiniteMixtureModel;\n    k::Int,\n    initialization::Union{String,Matrix} = \"kmeans\",\n    α = 1,\n    ν0 = 1,\n    κ0 = 0.001,\n    μ0 = nothing,\n    Σ0 = nothing,\n    ignoreSteps::Int = 1000, \n    saveSteps::Int = 1000,\n    saveEach::Int = 10,\n    verbose = false,\n    seed = 0\n    )\n\nFunction to fit a convolved finite mixture model to data.\n\nArguments:\n\nX::Matrix: Matrix with data to be fitted as (realizations, dimensions).\nY::GaussianFiniteMixtureModel: Mixture model used to fit the noise of the convolution.\n\nKeyword Arguments:\n\nk::Int: Number of components of the mixture of the target.\ninitialization::Union{String,Matrix} = \"kmeans\": Method to initializate the mixture parameters. \nα = 1: Hyperparameter of the Dirichlet distribution. The higher, the more probable that a cell will be assigned to another distribution.\nν0 = 1: Hyperparameter of the InverseWishart distribution. The highler, the more wight has the pior InverseWishart.\nκ0 = 0.001: Hyperparameter of the Normal prior distribution. The higher, the more focussed will be the prior Normal around the mean.\nμ0 = nothing: Hyperparameter of indicating the mean of the Normal. If nothing it will be estimated.\nΣ0 = nothing: Hyperparameter indicating the prior Covariance distribution of the model. If nothing it will be estimated.\nignoreSteps::Int = 1000: Number of steps to perform before saving realizations.\nsaveSteps::Int = 1000: Number of steps to perform from which we will save samples.\nsaveEach::Int = 10: Number of steps to take before saving a sample. \nverbose = false: Is to show progress of the fitting.\nseed = 0: Seed of the random generator.\n\nReturn \n\nA GaussianFiniteMixtureModelDeconvolved with the sampling of the bayesian model.\n\n\n\n\n\n","category":"function"},{"location":"API.html#scBayesDeconv.infiniteGaussianMixtureDeconvolution","page":"API","title":"scBayesDeconv.infiniteGaussianMixtureDeconvolution","text":"infiniteGaussianMixtureDeconvolution(X::Matrix, Y::GaussianMixtureModel;\n    k::Int,\n    initialization::Union{String,Matrix} = \"kmeans\",\n    α = 1,\n    ν0 = 1,\n    κ0 = 0.001,\n    μ0 = nothing,\n    Σ0 = nothing,\n    ignoreSteps::Int = 1000, \n    saveSteps::Int = 1000,\n    saveEach::Int = 10,\n    verbose = false,\n    seed = 0,\n    prune = 0.1\n    )\n\nFunction to fit a convolved finite mixture model to data.\n\nArguments:\n\nX::Matrix: Matrix with data to be fitted as (realizations, dimensions).\nY::GaussianMixtureModel: Mixture model used to fit the noise of the convolution.\n\nKeyword Arguments:\n\nk::Int: Number of components of the mixture to start with.\ninitialization::Union{String,Matrix} = \"kmeans\": Method to initializate the mixture parameters. \nα = 1: Hyperparameter of the Dirichlet distribution. The higher, the more probable that a cell will be assigned to another distribution.\nν0 = 1: Hyperparameter of the InverseWishart distribution. The highler, the more wight has the pior InverseWishart.\nκ0 = 0.001: Hyperparameter of the Normal prior distribution. The higher, the more focussed will be the prior Normal around the mean.\nμ0 = nothing: Hyperparameter of indicating the mean of the Normal. If nothing it will be estimated.\nΣ0 = nothing: Hyperparameter indicating the prior Covariance distribution of the model. If nothing it will be estimated.\nignoreSteps::Int = 1000: Number of steps to perform before saving realizations.\nsaveSteps::Int = 1000: Number of steps to perform from which we will save samples.\nsaveEach::Int = 10: Number of steps to take before saving a sample. \nverbose = false: Is to show progress of the fitting.\nseed = 0: Seed of the random generator.\nprune = 0.1: Cutoff to remove any basis from the noise distribution that is below this weight. \n\nAs infinite mixtures may have many basis that are only allocated to ver few cells (starting clusters) during the creation of new clusters, they do not realy contribute to the effective distribution but increase substantially the number of call to the likelihood function that is one of the most costly steps. Pruning unimportant basis can highly reduce the computation of the convolved model.\n\nReturn \n\nA GaussianInfiniteMixtureModelDeconvolved with the sampling of the bayesian model.\n\n\n\n\n\n","category":"function"},{"location":"API.html#Other-deconvolution-models","page":"API","title":"Other deconvolution models","text":"","category":"section"},{"location":"API.html","page":"API","title":"API","text":"neumannDeconvolution","category":"page"},{"location":"API.html#scBayesDeconv.neumannDeconvolution","page":"API","title":"scBayesDeconv.neumannDeconvolution","text":"function neumannDeconvolution(noise::Matrix,conv::Matrix,d1=1,d2=1,dw=0.01,w_lims=[-100,100],dx=0.01,x_lims=[-100,100],cut_off=true)\n\nFast-Fourier method for the deconvolution of two distributions as proposed by Neumann & Hössjer.  This method as implemented only works for 1D distributions.\n\nArguments:\n\nnoise::Matrix: Autofluorescence data of size (NSamples,1).\nconv::Matrix: Convolution data of size (NSamples,1).\nd1=1: Weight of the estimation of the frequencies to be removed based on the size of the data.\nd2=1: Weight of the estimation of the frequencies to be removed  based on the size of the data.\ndw=0.01: Width of the frequency sampling.\nw_lims=[-100,100]: Limits of the frequency domain.\ndx=0.01: Width of the spatial sampling.\nx_lims=[-100,100]: Limits of the spatial domain.\ncut_off=true: If to use the cutoff of the frequencies (in the original method this is true).\n\nReturns:\n\nDeconvolved signal, Points of the deconvolved signal determined by x_lims and dx.\n\n\n\n\n\n","category":"function"},{"location":"API.html#Metrics","page":"API","title":"Metrics","text":"","category":"section"},{"location":"API.html#MISE","page":"API","title":"MISE","text":"","category":"section"},{"location":"API.html","page":"API","title":"API","text":"Is the Mean Integrated Squared Error metric defined as","category":"page"},{"location":"API.html","page":"API","title":"API","text":"MISE = int (f_2(bmx)-f_1(bmx))^2 dbmx","category":"page"},{"location":"API.html","page":"API","title":"API","text":"scBayesDeconv.metrics.mise","category":"page"},{"location":"API.html#scBayesDeconv.metrics.mise","page":"API","title":"scBayesDeconv.metrics.mise","text":"function mise(model::GaussianMixtureModel,f2;box=[-100. 100.],d=.1,samples=1:length(model.samples))\n\nFunction to compute the Mean Integrated Squared error of between two distributions.\n\nArguments:\n\nmodel::BayesianMixtureModel: Bayesian Mixture Model from which to draw samples.\nf: Distribution against which to compare the model samples.\n\nKeyword Args:\n\nbox=[-100. 100.]: Matrix with box of integration with (min max) in columns and dimensions in rows.\nd=.1: Width of integration steps.\nsamples=1:length(model.samples): Samples from which to draw from the Bayesian model to compare agains the function.\n\nReturn \n\nThe MISE values for each iteration.\n\n\n\n\n\nfunction mise(f1,f2;box,d)\n\nFunction to compute the Mean Integrated Squared error of between two distributions.\n\nArguments:\n\nf1: Distribution 1.\nf2: Distribution 2.\n\nKeyword Args:\n\nbox: Matrix with box of integration with (min max) in columns and dimensions in rows.\nd: Width of integration steps.\n\nReturn \n\nThe MISE value.\n\n\n\n\n\n","category":"function"},{"location":"API.html#MISE-2","page":"API","title":"MISE","text":"","category":"section"},{"location":"API.html","page":"API","title":"API","text":"Is the Mean Integrated Overlap metric defined as","category":"page"},{"location":"API.html","page":"API","title":"API","text":"MIO = 1 - frac12int f_2(bmx)-f_1(bmx) dbmx","category":"page"},{"location":"API.html","page":"API","title":"API","text":"which makes de metric bounded as MIO in(01), being 1 is the distributions overlap perfectly and zero is there is no overlap in the domain at all.","category":"page"},{"location":"API.html","page":"API","title":"API","text":"scBayesDeconv.metrics.mio","category":"page"},{"location":"API.html#scBayesDeconv.metrics.mio","page":"API","title":"scBayesDeconv.metrics.mio","text":"function mio(model1::GaussianMixtureModel,model2::GaussianMixtureModel;\n    box=[-100. 100.],d=.1,samples1=1:length(model1.samples),samples2=1:length(model2.samples),nSamples=100)\n\nFunction to compute the Mean Integrated Overlap error of between two bayesian mixture deconvolutions.\n\nArguments:\n\nmodel1::BayesianMixtureModel: Bayesian Mixture Model from which to draw samples.\nmodel2::BayesianMixtureModel: Bayesian Mixture Model from which to draw samples.\n\nKeyword Args:\n\nbox=[-100. 100.]: Matrix with box of integration with (min max) in columns and dimensions in rows.\nd=.1: Width of integration steps.\nsamples1=1:length(model.samples): Samples from which to draw from the Bayesian model to compare agains the function.\nsamples2=1:length(model.samples): Number of samples to draw from the Bayesian model to compare agains the function.\nnSamples=100: number of samples to draw from the distributions. \n\nReturn \n\nThe MIO values for each random sample.\n\n\n\n\n\nfunction mio(model::GaussianMixtureModel,f2;box=[-100. 100.],d=.1,samples=1:length(model.samples))\n\nFunction to compute the Mean Integrated Overlap error of between a Bayesian Mixture Model and a distribution.\n\nArguments:\n\nmodel::BayesianMixtureModel: Bayesian Mixture Model from which to draw samples.\nf2: Bayesian Mixture Model from which to draw samples.\n\nKeyword Args:\n\nbox=[-100. 100.]: Matrix with box of integration with (min max) in columns and dimensions in rows.\nd=.1: Width of integration steps.\nsamples=1:length(model.samples): Samples from which to draw from the Bayesian model to compare agains the function.\n\nReturn \n\nThe MIO value for each sample.\n\n\n\n\n\nfunction mio(f1,f2;box,d)\n\nFunction to compute the Mean Integrated Squared error of between two distributions.\n\nArguments:\n\nf1: Distribution 1.\nf2: Distribution 2.\n\nKeyword Args:\n\nbox=[-100. 100.]: Matrix with box of integration with (min max) in columns and dimensions in rows.\nd=.1: Width of integration steps.\n\nReturn:\n\nThe mio value.\n\n\n\n\n\n","category":"function"}]
}
