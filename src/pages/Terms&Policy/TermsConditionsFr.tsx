import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import AppLayout from '@components/Page/AppLayout'
import '@assets/css/pages/Terms&Conditions.css'
import Clause from './components/Clause'
import { isMobile } from '@utils/helpers'
import { useNavigate } from 'react-router'
import { useSelector, useDispatch } from 'react-redux'
import {
  getWalletDetails,
  showWalletForm,
} from '@root/apis/onboarding/authenticationSlice'
import { RootState } from '@root/store/rootReducers'
const TermsConditionsFr: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const accessToken = localStorage.getItem('accessToken')
  const { isNoWallet, userName, walletDetailAddress } = authenticationData

  useEffect(() => {
    if (userName) {
      if (accessToken && !walletDetailAddress) {
        dispatch(getWalletDetails()) // COMMENTED FOR PROD
      }
    }
  }, [userName])

  useEffect(() => {
    if (isNoWallet && !localStorage.getItem('loginInfo')) {
      dispatch(showWalletForm({ isMandatory: true }))
    }
  }, [isNoWallet])

  return (
    <div className="terms-container">
      <div className="mt-20 mb-20">
        <Clause
          title={t('Terms & Conditions (FR)')}
          isMainTitle
          fontStyle="text-left ct-h1"
        >
          <div className="terms-content ct-p1">
            Welcome to <a href="#">https://mecarreira.com</a>, a website-hosted
            user interface (the "Interface" or "App") provided by meCarreira AG
            ("we", "our", or "us"). The Interface provides access to a
            decentralized protocol on the Polygon blockchain that allows users
            to interact with smart contracts ("the meCarreira protocol" or the
            "Protocol").The Interface is one, but not the exclusive, means of
            accessing the Protocol.
            <br /> <br /> These Terms of Service govern your use of the website
            located at <a href="#">https://mecarreira.com</a> and any related
            services provided by meCarreira AG.
            <br /> <br /> By accessing <a href="#">https://mecarreira.com</a>,
            you agree to abide by these Terms of Service and to comply with all
            applicable laws and regulations. If you do not agree with these
            Terms of Service, you are prohibited from using or accessing this
            website or using any other services provided by meCarreira AG.
            <br /> <br /> We, meCarreira AG, reserve the right to review and
            amend any of these Terms of Service at our sole discretion. Upon
            doing so, we will update this page. Any changes to these Terms of
            Service will take effect immediately from the date of publication.
            These Terms of Service were last updated on 4 May 2022.
          </div>
        </Clause>
        <Clause title={t('Limitations of Use')} fontStyle="h-2">
          <div className="terms-content ct-p1">
            By using this website, you warrant on behalf of yourself, your
            users, and other parties you represent that you will not:
            <ol>
              <li>
                modify, copy, prepare derivative works of, decompile, or reverse
                engineer any materials and software contained on this website
              </li>
              <br />
              <li>
                remove any copyright or other proprietary notations from any
                materials and software on this website
              </li>
              <br />
              <li>
                transfer the materials to another person or “mirror” the
                materials on any other server
              </li>
              <br />
              <li>
                knowingly or negligently use this website or any of its
                associated services in a way that abuses or disrupts our
                networks or any other service meCarreira AG provides
              </li>
              <br />
              <li>
                use this website or its associated services to transmit or
                publish any harassing, indecent, obscene, fraudulent, or
                unlawful material
              </li>
              <br />
              <li>
                use this website or its associated services in violation of any
                applicable laws or regulations
              </li>
              <br />
              <li>
                use this website in conjunction with sending unauthorized
                advertising or spam
              </li>
              <br />
              <li>
                harvest, collect, or gather user data without the user’s
                consent; or
              </li>
              <br />
              <li>
                use this website or its associated services in such a way that
                may infringe the privacy, intellectual property rights, or other
                rights of third parties.
              </li>
            </ol>
          </div>
        </Clause>
        <Clause title={t('Intellectual Property')} fontStyle="h-2">
          <div className="terms-content ct-p1">
            <p>
              The intellectual property in the materials contained in this
              website are owned by or licensed to meCarreira AG and are
              protected by applicable copyright and trademark law. We grant our
              users permission to download one copy of the materials for
              personal, non-commercial transitory use.
            </p>
            <p>
              This constitutes the grant of a license, not a transfer of title.
              This license shall automatically terminate if you violate any of
              these restrictions or the Terms of Service, and may be terminated
              by meCarreira AG at any time.
            </p>
          </div>
        </Clause>
        <Clause title={t('Liability')} fontStyle="h-2">
          <div className="terms-content ct-p1">
            <p>
              Our website and the materials on our website are provided on an
              'as is' basis. To the extent permitted by law, meCarreira AG makes
              no warranties, expressed or implied, and hereby disclaims and
              negates all other warranties including, without limitation,
              implied warranties or conditions of merchantability, fitness for a
              particular purpose, or non-infringement of intellectual property,
              or other violation of rights.
            </p>
            <p>
              In no event shall meCarreira AG or its suppliers be liable for any
              consequential loss suffered or incurred by you or any third party
              arising from the use or inability to use this website or the
              materials on this website, even if meCarreira AG or an authorized
              representative has been notified, orally or in writing, of the
              possibility of such damage.
            </p>
            <p>
              In the context of this agreement, “consequential loss” includes
              any consequential loss, indirect loss, real or anticipated loss of
              profit, loss of benefit, loss of revenue, loss of business, loss
              of goodwill, loss of opportunity, loss of savings, loss of
              reputation, loss of use and/or loss or corruption of data, whether
              under statute, contract, equity, tort (including negligence),
              indemnity, or otherwise.
            </p>
            <p>
              Because some jurisdictions do not allow limitations on implied
              warranties, or limitations of liability for consequential or
              incidental damages, these limitations may not apply to you.
            </p>
          </div>
        </Clause>
        <Clause title={t('Accuracy of Materials')} fontStyle="h-2">
          <div className="terms-content ct-p1">
            The materials appearing on our website are not comprehensive and are
            for general information purposes only. meCarreira AG does not
            warrant or make any representations concerning the accuracy, likely
            results, or reliability of the use of the materials on this website,
            or otherwise relating to such materials or on any resources linked
            to this website.
          </div>
        </Clause>
        <Clause title={t('Links')} fontStyle="h-2">
          <div className="terms-content ct-p1">
            meCarreira AG has not reviewed all of the sites linked to its
            website and is not responsible for the contents of any such linked
            site. The inclusion of any link does not imply endorsement,
            approval, or control by meCarreira AG of the site. Use of any such
            linked site is at your own risk and we strongly advise you make your
            own investigations with respect to the suitability of those sites.
          </div>
        </Clause>
        <Clause title={t('Right to Terminate')} fontStyle="h-2">
          <div className="terms-content ct-p1">
            We may suspend or terminate your right to use our website and
            terminate these Terms of Service immediately upon written notice to
            you for any breach of these Terms of Service.
          </div>
        </Clause>
        <Clause title={t('Severance')} fontStyle="h-2">
          <div className="terms-content ct-p1">
            Any term of these Terms of Service which is wholly or partially void
            or unenforceable is severed to the extent that it is void or
            unenforceable. The validity of the remainder of these Terms of
            Service is not affected
          </div>
        </Clause>
        <Clause title={t('Governing Law')} fontStyle="h-2">
          <div className="terms-content ct-p1">
            These Terms of Service are governed by and construed in accordance
            with the laws of Switzerland. You irrevocably submit to the
            exclusive jurisdiction of the courts in that State or location.
          </div>
        </Clause>
      </div>
    </div>
  )
}

export default TermsConditionsFr
