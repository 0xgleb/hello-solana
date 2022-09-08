import * as assert from "assert";
import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
const { SystemProgram } = anchor.web3;
import { HelloSolana } from "../target/types/hello_solana";

describe("calculatordapp", () => {
  const provider = anchor.AnchorProvider.local();
  anchor.setProvider(provider);
  const calculator = anchor.web3.Keypair.generate();
  const program = anchor.workspace.HelloSolana as Program<HelloSolana>;

  it("Creates a calculator", async () => {
    await program.methods
      .create("Hello Solana!")
      .accounts({
        calculator: calculator.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([calculator])
      .rpc();

    const account = await program.account.calculator.fetch(
      calculator.publicKey
    );

    assert.ok(account.greeting === "Hello Solana!");
  });

  it("Adds numbers", async () => {
    await program.methods
      .add(new anchor.BN(2), new anchor.BN(3))
      .accounts({
        calculator: calculator.publicKey,
      })
      .rpc();

    const account = await program.account.calculator.fetch(
      calculator.publicKey
    );

    assert.ok(account.result.eq(new anchor.BN(5)));
  });

  it("Subtracts numbers", async () => {
    await program.methods
      .subtract(new anchor.BN(2), new anchor.BN(3))
      .accounts({
        calculator: calculator.publicKey,
      })
      .rpc();

    const account = await program.account.calculator.fetch(
      calculator.publicKey
    );

    assert.ok(account.result.eq(new anchor.BN(-1)));
  });

  it("Multiplies numbers", async () => {
    await program.methods
      .multiply(new anchor.BN(2), new anchor.BN(3))
      .accounts({
        calculator: calculator.publicKey,
      })
      .rpc();

    const account = await program.account.calculator.fetch(
      calculator.publicKey
    );

    assert.ok(account.result.eq(new anchor.BN(6)));
  });

  it("Divides numbers", async () => {
    await program.methods
      .divide(new anchor.BN(10), new anchor.BN(3))
      .accounts({
        calculator: calculator.publicKey,
      })
      .rpc();

    const account = await program.account.calculator.fetch(
      calculator.publicKey
    );

    assert.ok(account.result.eq(new anchor.BN(3)));
    assert.ok(account.remainder.eq(new anchor.BN(1)));
  });
});
