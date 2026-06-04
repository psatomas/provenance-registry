import {
    getProvider,
    SEPOLIA_CONFIG,
    SUPPORTED_CHAIN_ID
} from "./web3";

export async function ensureSepoliaNetwork() {

    const provider = await getProvider();

    const network = await provider.getNetwork();

    if (
        Number(network.chainId) ===
        SUPPORTED_CHAIN_ID
    ) {
        return true;
    }

    try {

        await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [
                {
                    chainId: SEPOLIA_CONFIG.chainId,
                },
            ],
        });

        return true;

    } catch (switchError: any) {

        // Chain not added to wallet

        if (switchError.code === 4902) {

            await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [SEPOLIA_CONFIG],
            });

            return true;
        }

        throw switchError;
    }
}