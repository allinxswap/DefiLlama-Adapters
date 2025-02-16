module.exports = {
  misrepresentedTokens: true,
  hallmarks: [[1688342964, "Launch Sake Vault"]],
  arbitrum: {
    tvl: async (_, _b, _cb, { api }) => {
      const vaults = [
        "0x0081772FD29E4838372CbcCdD020f53954f5ECDE", // VodkaVault
        "0x6df0018b0449bB4468BfAE8507E13021a7aa0583", // WaterVault
      ];
      const bals = await api.multiCall({
        abi: "int256:getVaultMarketValue",
        calls: vaults,
      });

      const addresses = {
        whiskey: "0x6532eFCC1d617e094957247d188Ae6d54093718A",
        whiskeyWater: "0xa100E02e861132C4703ae96D6868664f27Eaa431",
        sake: "0x45BeC5Bb0EE87181A7Aa20402C66A6dC4A923758",
        sakeWater: "0x6b367F9EB22B2E6074E9548689cddaF9224FC0Ab",
        sakeV2: "0xc53A53552191BeE184557A15f114a87a757e5b6F",
        sakeWaterV2: "0x806e8538FC05774Ea83d9428F778E423F6492475",
        vodkaV1_Water: "0xC99C6427cB0B824207606dC2745A512C6b066E7C",
        VodkaV1: "0x88D7500aF99f11fF52E9f185C7aAFBdF9acabD93",
        fsGlp: "0x1aDDD80E6039594eE970E5872D247bf0414C8903",
      };

      const contractAbis = {
        gainsBalance: "function getGainsBalance() view returns (uint256)",
        gTokenPrice: "function gTokenPrice() view returns (uint256)",
        wWaterBalance: "function balanceOfDAI() public view returns (uint256)",
        vlpBalance: "function getVlpBalance() public view returns (uint256)",
        stakedVlpBalance:
          "function getStakedVlpBalance() public view returns (uint256)",
        vlpPrice: "function getVLPPrice() public view returns (uint256)",
        glpPrice: "function getGLPPrice(bool) public view returns (uint256)",
        waterUSDCBal: "function balanceOfUSDC() public view returns (uint256)",
        balanceOf: "function balanceOf(address) view returns (uint256)",
      };

      const whiskeyGainsBalance = await api.call({
        abi: contractAbis.gainsBalance,
        target: addresses.whiskey,
      });

      const whiskeyGTokenPrice = await api.call({
        abi: contractAbis.gTokenPrice,
        target: addresses.whiskey,
      });

      const whiskeyWaterDaiBal = await api.call({
        abi: contractAbis.wWaterBalance,
        target: addresses.whiskeyWater,
      });

      const sakeWaterUSDCBal = await api.call({
        abi: contractAbis.waterUSDCBal,
        target: addresses.sakeWater,
      });

      const vlpBal = await api.call({
        abi: contractAbis.vlpBalance,
        target: addresses.sake,
      });

      const StakedVLPBal = await api.call({
        abi: contractAbis.stakedVlpBalance,
        target: addresses.sake,
      });

      const sakeVLPPrice = await api.call({
        abi: contractAbis.vlpPrice,
        target: addresses.sake,
      });

      const sakeWaterUSDCBalV2 = await api.call({
        abi: contractAbis.waterUSDCBal,
        target: addresses.sakeWaterV2,
      });

      const vlpBalV2 = await api.call({
        abi: contractAbis.vlpBalance,
        target: addresses.sakeV2,
      });

      const StakedVLPBalV2 = await api.call({
        abi: contractAbis.stakedVlpBalance,
        target: addresses.sakeV2,
      });

      const vodkaWaterUSDCBalV1 = await api.call({
        abi: contractAbis.waterUSDCBal,
        target: addresses.vodkaV1_Water,
      });

      const vodkaGLPPrice = await api.call({
        abi: contractAbis.glpPrice,
        target: addresses.VodkaV1,
        params: [true],
      });

      const vodkaGLPBalV1 = await api.call({
        abi: contractAbis.balanceOf,
        target: addresses.fsGlp,
        params: [addresses.VodkaV1],
      });

      return {
        tether: bals.reduce((a, i) => a + i / 1e6, 0),
        dai:
          (whiskeyGainsBalance * whiskeyGTokenPrice) / 1e36 +
          whiskeyWaterDaiBal / 1e18,
        "usd-coin":
          ((vlpBal + StakedVLPBal) * sakeVLPPrice) / 1e18 / 1e5 +
          sakeWaterUSDCBal / 1e6 +
          ((vlpBalV2 + StakedVLPBalV2) * sakeVLPPrice) / 1e18 / 1e5 +
          sakeWaterUSDCBalV2 / 1e6 +
          vodkaWaterUSDCBalV1 / 1e6 +
          (vodkaGLPBalV1 * vodkaGLPPrice) / 1e18 / 1e18,
      };
    },
  },
};
