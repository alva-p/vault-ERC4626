export default function VaultPanel() {
  return (
    <section className="vault-panel">
      <div className="vault-header">
        <p className="vault-kicker">MVP · ERC-4626</p>
        <h2 className="vault-title">Simple Vault</h2>
        <p className="vault-subtitle">Passive yield vault with share-based accounting and transparent conversions.</p>
      </div>
      <div className="vault-stats">
        <div>
          <span className="vault-label">Total assets</span>
          <span className="vault-value">$12.4M</span>
        </div>
        <div>
          <span className="vault-label">Price per share</span>
          <span className="vault-value">1.12</span>
        </div>
        <div>
          <span className="vault-label">APY</span>
          <span className="vault-value">4.8%</span>
        </div>
      </div>
      <div className="vault-actions">
        <label className="vault-field">
          <span>Deposit amount</span>
          <input type="text" placeholder="1000" />
        </label>
        <div className="vault-buttons">
          <button className="vault-button primary" type="button">
            Deposit
          </button>
          <button className="vault-button" type="button">
            Withdraw
          </button>
        </div>
      </div>
      <p className="vault-footnote">Wallet connection coming next via RainbowKit.</p>
    </section>
  );
}
